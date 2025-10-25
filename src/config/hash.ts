import 'dotenv/config';

export const HASH_CONFIG = {
  salt: process.env.HASH_SALT || 10,
};
