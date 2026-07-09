import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import authService from '../services/authService';
import { authValidation, validateRequest } from '../utils/validators';

export const register = [
  ...authValidation,
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { email, username, password, first_name, last_name } = req.body;
    const user = await authService.register(email, username, password, first_name, last_name);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  }),
];

export const login = [
  ...authValidation,
  validateRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token,
    });
  }),
];

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  await authService.logout(req.user.id);
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});
