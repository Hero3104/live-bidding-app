import pool from '../config/database';
import redisClient from '../config/redis';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { ValidationError, ConflictError, AuthenticationError } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types';

export class AuthService {
  async register(email: string, username: string, password: string, firstName?: string, lastName?: string): Promise<User> {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      throw new ConflictError('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userId = uuidv4();
    const result = await pool.query(
      `INSERT INTO users (id, email, username, password_hash, first_name, last_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, username, first_name, last_name, role, is_active, created_at, updated_at`,
      [userId, email, username, hashedPassword, firstName || null, lastName || null, 'user', true]
    );

    return result.rows[0] as User;
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const result = await pool.query(
      'SELECT id, email, username, password_hash, first_name, last_name, role, is_active FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new AuthenticationError('Invalid email or password');
    }

    const user = result.rows[0];

    // Check password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    if (!user.is_active) {
      throw new AuthenticationError('User account is inactive');
    }

    // Update last login
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_active: user.is_active,
      } as User,
      token,
    };
  }

  async logout(userId: string): Promise<void> {
    // Invalidate token in Redis (optional)
    await redisClient.setEx(`logout:${userId}`, 86400, '1');
  }
}

export default new AuthService();
