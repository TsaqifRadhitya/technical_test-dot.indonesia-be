import 'dotenv/config';

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'secret',
};
