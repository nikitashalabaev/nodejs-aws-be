import 'source-map-support/register';

import { Pool } from 'pg';
import dbConfig from '../../dbConfig';
import { middyfy, formatJSONResponse } from 'shared-lib';
import ProductsRepo from '../../products.repo';

let pool;
const productsRepo = new ProductsRepo();

const createProduct = async (event) => {
  if (!pool) {
    pool = new Pool(dbConfig);
  }

  const client = await pool.connect();
  productsRepo.setClient(client);

  try {
    await productsRepo.create(event.body);

    return formatJSONResponse({ response: 'Product created' });
  } catch (e) {
    return formatJSONResponse({ statusCode: 500, response: e.message });
  } finally {
    client.release();
  }
}

export const main = middyfy(createProduct);

export default createProduct;