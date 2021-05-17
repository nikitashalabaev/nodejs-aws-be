import 'source-map-support/register';

import { Pool } from 'pg';
import dbConfig from '../../dbConfig';
import { middyfy, formatJSONResponse } from 'shared-lib';

let pool;

const getProductsById = async (event) => {
  if (!pool) {
    pool = new Pool(dbConfig);
  }

  const client = await pool.connect();

  try {
    const { productId } = event.pathParameters;

    const { rows: [product] } = await client.query(`
      SELECT id, title, description, price, count FROM products p LEFT JOIN stocks s ON p.id = s.product_id WHERE id='${productId}' 
    `);

    return product
      ? formatJSONResponse({ response: product })
      : formatJSONResponse({ statusCode: 404, response: 'Product not found' });
  } catch (e) {
    return formatJSONResponse({ statusCode: 500, response: e.message });
  } finally {
    client.release();
  }
}

export const main = middyfy(getProductsById);

export default getProductsById;