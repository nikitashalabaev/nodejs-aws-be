import 'source-map-support/register';

import { Pool } from 'pg';
import dbConfig from '../../dbConfig';
import { middyfy } from '../../libs/lambda';
import { formatJSONResponse } from '../../libs/apiGateway';

let pool;

const createProduct = async (event) => {
  if (!pool) {
    pool = new Pool(dbConfig);
  }

  const client = await pool.connect();

  try {
    const { title, description, price, count } = event.body;

    const products = await client.query(`
      INSERT INTO products (title, description, price) VALUES ('${title}', '${description}', ${Number(price)}) RETURNING id
    `);

    const productID = products.rows[0].id;

    await client.query(`
      INSERT INTO stocks (product_id, count) VALUES ('${productID}', '${Number(count)}')
    `);

    return formatJSONResponse({ response: 'Product created' });
  } catch (e) {
    return formatJSONResponse({ statusCode: 500, response: e.message });
  } finally {
    client.release();
  }
}

export const main = middyfy(createProduct);

export default createProduct;