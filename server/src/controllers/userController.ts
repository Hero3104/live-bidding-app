import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import userService from '../services/userService';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  const user = await userService.getUserById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  const { first_name, last_name } = req.body;
  const user = await userService.updateUser(req.user.id, first_name, last_name);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
