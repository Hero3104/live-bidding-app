import { body, validationResult, RequestHandler } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './errors';

export const validateRequest: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array());
  }
  next();
};

export const authValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters').isAlphanumeric().withMessage('Username must be alphanumeric'),
];

export const auctionValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').notEmpty().withMessage('Description is required').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('starting_price').isFloat({ min: 0.01 }).withMessage('Starting price must be greater than 0'),
  body('start_time').isISO8601().withMessage('Start time must be a valid date'),
  body('end_time').isISO8601().withMessage('End time must be a valid date'),
];

export const bidValidation = [
  body('auction_id').isUUID().withMessage('Invalid auction ID'),
  body('bid_amount').isFloat({ min: 0.01 }).withMessage('Bid amount must be greater than 0'),
];
