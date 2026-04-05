import { Request, Response } from 'express';
import { User, UserRole } from '../models/User';

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

export const updateUserRole = async (req: Request, res: Response) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  // Prevent changing the role of the main admin to avoid locking out.
  // Assuming the main seeded admin can't be easily demoted.
  if (user.email === 'admin@zoryn.com') {
    res.status(403).json({ message: 'Cannot modify primary Admin role' });
    return;
  }

  if (Object.values(UserRole).includes(role)) {
    user.role = role;
    await user.save();
    res.json({ message: 'User role updated successfully', user: { _id: user.id, name: user.name, role: user.role } });
  } else {
    res.status(400).json({ message: 'Invalid role' });
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (user.email === 'admin@zoryn.com') {
    res.status(403).json({ message: 'Cannot modify primary Admin status' });
    return;
  }

  user.isActive = !user.isActive;
  await user.save();
  
  res.json({ message: `User is now ${user.isActive ? 'active' : 'inactive'}`, user: { _id: user.id, name: user.name, isActive: user.isActive } });
};
