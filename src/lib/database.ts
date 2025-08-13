// Database configuration and connection for MENU EVA
import mysql from 'mysql2/promise';

// Database configuration
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'menu_eva_db',
  charset: 'utf8mb4',
  timezone: '+00:00',
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};

// Create connection pool
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Database connection helper
export async function connectDB() {
  try {
    const connection = await getPool().getConnection();
    console.log('✅ Connected to MySQL database successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Execute query helper
export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const [rows] = await getPool().execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Database types matching our schema
export interface Category {
  id: number;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  category_id: number;
  is_available: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Promotion {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
  start_date?: Date;
  end_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Discount {
  id: number;
  code: string;
  percentage: number;
  status: 'active' | 'expired' | 'disabled';
  usage_limit?: number;
  used_count: number;
  start_date?: Date;
  end_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  total_amount: number;
  discount_code?: string;
  discount_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
  created_at: Date;
}
