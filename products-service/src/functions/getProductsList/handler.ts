import 'source-map-support/register';

import { Pool } from 'pg';
import dbConfig from '../../dbConfig';
import { middyfy } from '../../libs/lambda';
import { formatJSONResponse } from '../../libs/apiGateway';

let pool;

const getProductsList = async () => {
  if (!pool) {
    pool = new Pool(dbConfig);
  }

  const client = await pool.connect();

  try {
    const { rows } = await client.query(`
      SELECT id, title, description, price, count FROM products p LEFT JOIN stocks s ON p.id = s.product_id
    `);

    return formatJSONResponse({ response: rows });
  } catch (e) {
    return formatJSONResponse({ statusCode: 500, response: e.message });
  } finally {
    client.release();
  }
}

export const main = middyfy(getProductsList);

export default getProductsList;