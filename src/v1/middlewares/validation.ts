import { Handler } from 'express';
import { validationResult } from 'express-validator';

export const validate: Handler = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({ errors: validationErrors.array() });
  }
  next();
};
