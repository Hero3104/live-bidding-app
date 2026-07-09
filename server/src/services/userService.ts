import pool from '../config/database';
import { User } from '../types';
import { NotFoundError } from '../utils/errors';

export class UserService {
  async getUserById(userId: string): Promise<User> {
    const result = await pool.query(
      'SELECT id, email, username, first_name, last_name, role, is_active, created_at, updated_at, last_login FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    return result.rows[0] as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, email, username, first_name, last_name, role, is_active, created_at, updated_at, last_login FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as User;
  }

  async updateUser(userId: string, firstName?: string, lastName?: string): Promise<User> {
    const result = await pool.query(
      `UPDATE users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, email, username, first_name, last_name, role, is_active, created_at, updated_at, last_login`,
      [firstName || null, lastName || null, userId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('User not found');
    }

    return result.rows[0] as User;
  }

  async getActiveUsers(): Promise<number> {
    const result = await pool.query('SELECT COUNT(*) as count FROM users WHERE is_active = true');
    return parseInt(result.rows[0].count, 10);
  }
}

export default new UserService();
