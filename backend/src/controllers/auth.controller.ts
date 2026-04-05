import { Request, Response } from 'express';
import { User, UserRole } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  if (role === UserRole.ADMIN) {
    res.status(403).json({ message: 'Cannot register as an Admin user' });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || UserRole.VIEWER,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && !user.isActive) {
    res.status(403).json({ message: 'Account has been deactivated' });
    return;
  }

  if (user && user.password && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user.id).select('-password');
  res.json(user);
};
