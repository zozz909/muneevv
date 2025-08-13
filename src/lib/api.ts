// API functions for database operations
import { executeQuery, Category, Product, Promotion, Discount } from './database';

// Categories API
export const categoriesAPI = {
  // Get all active categories
  async getAll(): Promise<Category[]> {
    const query = `
      SELECT * FROM categories 
      WHERE is_active = true 
      ORDER BY display_order ASC, name ASC
    `;
    return executeQuery<Category>(query);
  },

  // Get category by ID
  async getById(id: number): Promise<Category | null> {
    const query = 'SELECT * FROM categories WHERE id = ? AND is_active = true';
    const results = await executeQuery<Category>(query, [id]);
    return results[0] || null;
  },

  // Create new category
  async create(data: { name: string; name_en?: string; description?: string; description_en?: string; display_order?: number }): Promise<number> {
    const query = `
      INSERT INTO categories (name, name_en, description, description_en, display_order)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await executeQuery(query, [
      data.name,
      data.name_en || null,
      data.description || null,
      data.description_en || null,
      data.display_order || 0
    ]);
    return (result as any).insertId;
  },

  // Update category
  async update(id: number, data: Partial<Category>): Promise<boolean> {
    const fields = Object.keys(data).filter(key => key !== 'id').map(key => `${key} = ?`);
    const values = Object.values(data).filter((_, index) => Object.keys(data)[index] !== 'id');
    
    const query = `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`;
    await executeQuery(query, [...values, id]);
    return true;
  },

  // Delete category permanently from database
  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM categories WHERE id = ?';
    await executeQuery(query, [id]);
    return true;
  },

  // Soft delete category (hide only)
  async softDelete(id: number): Promise<boolean> {
    const query = 'UPDATE categories SET is_active = false WHERE id = ?';
    await executeQuery(query, [id]);
    return true;
  }
};

// Products API
export const productsAPI = {
  // Get all available products
  async getAll(): Promise<Product[]> {
    const query = `
      SELECT * FROM products 
      WHERE is_available = true 
      ORDER BY display_order ASC, name ASC
    `;
    return executeQuery<Product>(query);
  },

  // Get products by category
  async getByCategory(categoryId: number): Promise<Product[]> {
    const query = `
      SELECT * FROM products
      WHERE category_id = ? AND is_available = true
      ORDER BY display_order ASC, name ASC
    `;
    return executeQuery<Product>(query, [categoryId]);
  },

  // Get bestseller products
  async getBestsellers(): Promise<Product[]> {
    const query = `
      SELECT * FROM products
      WHERE is_bestseller = true AND is_available = true
      ORDER BY display_order ASC, name ASC
    `;
    return executeQuery<Product>(query);
  },

  // Get product by ID
  async getById(id: number): Promise<Product | null> {
    const query = 'SELECT * FROM products WHERE id = ? AND is_available = true';
    const results = await executeQuery<Product>(query, [id]);
    return results[0] || null;
  },

  // Create new product
  async create(data: {
    name: string;
    name_en?: string;
    description?: string;
    description_en?: string;
    price: number;
    original_price?: number;
    calories?: number;
    image_url?: string;
    category_id: number;
    display_order?: number;
    is_bestseller?: boolean;
    is_new?: boolean;
    new_until_date?: string | null;
  }): Promise<number> {
    const query = `
      INSERT INTO products (name, name_en, description, description_en, price, original_price, calories, calories_unit, image_url, category_id, display_order, is_bestseller, is_new, new_until_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await executeQuery(query, [
      data.name,
      data.name_en || null,
      data.description || null,
      data.description_en || null,
      data.price,
      data.original_price || null,
      data.calories || null,
      data.calories ? 'kcal' : null,
      data.image_url || null,
      data.category_id,
      data.display_order || 0,
      data.is_bestseller || false,
      data.is_new || false,
      data.new_until_date || null
    ]);
    return (result as any).insertId;
  },

  // Update product
  async update(id: number, data: Partial<Product>): Promise<boolean> {
    const fields = Object.keys(data).filter(key => key !== 'id').map(key => `${key} = ?`);
    const values = Object.values(data).filter((_, index) => Object.keys(data)[index] !== 'id');
    
    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    await executeQuery(query, [...values, id]);
    return true;
  },

  // Delete product permanently from database
  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM products WHERE id = ?';
    await executeQuery(query, [id]);
    return true;
  },

  // Soft delete product (hide only)
  async softDelete(id: number): Promise<boolean> {
    const query = 'UPDATE products SET is_available = false WHERE id = ?';
    await executeQuery(query, [id]);
    return true;
  }
};

// Promotions API
export const promotionsAPI = {
  // Get all active promotions
  async getAll(): Promise<Promotion[]> {
    const query = `
      SELECT * FROM promotions
      WHERE is_active = true
      ORDER BY display_order ASC, created_at DESC
    `;
    return executeQuery<Promotion>(query);
  },

  // Get promotion by ID
  async getById(id: number): Promise<Promotion | null> {
    const query = 'SELECT * FROM promotions WHERE id = ? AND is_active = true';
    const results = await executeQuery<Promotion>(query, [id]);
    return results[0] || null;
  },

  // Create new promotion
  async create(data: {
    title: string;
    description?: string;
    image_url?: string;
    display_order?: number;
    start_date?: Date;
    end_date?: Date;
  }): Promise<number> {
    const query = `
      INSERT INTO promotions (title, description, image_url, display_order, is_active, start_date, end_date)
      VALUES (?, ?, ?, ?, true, ?, ?)
    `;
    const result = await executeQuery(query, [
      data.title,
      data.description || null,
      data.image_url || null,
      data.display_order || 0,
      data.start_date || null,
      data.end_date || null
    ]);
    return (result as any).insertId;
  },

  // Update promotion
  async update(id: number, data: Partial<Promotion>): Promise<boolean> {
    const fields = Object.keys(data).filter(key => key !== 'id').map(key => `${key} = ?`);
    const values = Object.values(data).filter((_, index) => Object.keys(data)[index] !== 'id');

    const query = `UPDATE promotions SET ${fields.join(', ')} WHERE id = ?`;
    await executeQuery(query, [...values, id]);
    return true;
  },

  // Delete promotion permanently from database
  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM promotions WHERE id = ?';
    await executeQuery(query, [id]);
    return true;
  },

  // Soft delete promotion (hide only)
  async softDelete(id: number): Promise<boolean> {
    const query = 'UPDATE promotions SET is_active = false WHERE id = ?';
    await executeQuery(query, [id]);
    return true;
  }
};

// Discounts API
export const discountsAPI = {
  // Get all discounts
  async getAll(): Promise<Discount[]> {
    const query = `
      SELECT * FROM discounts
      ORDER BY created_at DESC
    `;
    return executeQuery<Discount>(query);
  },

  // Get discount by ID
  async getById(id: number): Promise<Discount | null> {
    const query = 'SELECT * FROM discounts WHERE id = ?';
    const results = await executeQuery<Discount>(query, [id]);
    return results[0] || null;
  },

  // Get discount by code
  async getByCode(code: string): Promise<Discount | null> {
    const query = 'SELECT * FROM discounts WHERE code = ? AND status = "active"';
    const results = await executeQuery<Discount>(query, [code]);
    return results[0] || null;
  },

  // Create new discount
  async create(data: {
    code: string;
    percentage: number;
    usage_limit?: number;
    start_date?: Date;
    end_date?: Date;
  }): Promise<number> {
    const query = `
      INSERT INTO discounts (code, percentage, usage_limit, start_date, end_date)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await executeQuery(query, [
      data.code,
      data.percentage,
      data.usage_limit || null,
      data.start_date || null,
      data.end_date || null
    ]);
    return (result as any).insertId;
  },

  // Update discount
  async update(id: number, data: Partial<Discount>): Promise<boolean> {
    const fields = Object.keys(data).filter(key => key !== 'id').map(key => `${key} = ?`);
    const values = Object.values(data).filter((_, index) => Object.keys(data)[index] !== 'id');

    const query = `UPDATE discounts SET ${fields.join(', ')} WHERE id = ?`;
    await executeQuery(query, [...values, id]);
    return true;
  },

  // Delete discount
  async delete(id: number): Promise<boolean> {
    const query = 'UPDATE discounts SET status = "disabled" WHERE id = ?';
    await executeQuery(query, [id]);
    return true;
  }
};
