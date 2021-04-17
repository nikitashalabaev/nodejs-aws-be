import 'source-map-support/register';

import { Pool } from 'pg';
import dbConfig from '../../dbConfig';

let pool;

const seedProductService = async () => {
  if (!pool) {
    pool = new Pool(dbConfig);
  }

  const client = await pool.connect();

  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS products
      (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR NOT NULL,
        description VARCHAR,
        price INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS stocks
      (
        product_id UUID REFERENCES products (id),
        count integer
      );
    `);

    await client.query(`
      INSERT INTO products (title, description, price) VALUES
        ('prod 1', 'descr 1', 10),
        ('prod 2', 'descr 2', 20),
        ('prod 3', 'descr 3', 30);
      
      INSERT INTO stocks (product_id, count) VALUES
        ((SELECT id from products WHERE price=10), 10),
        ((SELECT id from products WHERE price=20), 20),
        ((SELECT id from products WHERE price=30), 20);
    `);


    console.log('DBs are created and populated');
  } catch (e) {
    console.error('Error during database request executing:', e);
  } finally {
    client.release(); // release connection for other executions
  }
}

export const main = seedProductService;

export default seedProductService;