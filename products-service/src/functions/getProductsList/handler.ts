import 'source-map-support/register';

import { Pool } from 'pg';
import dbConfig from '../../dbConfig';
import { middyfy, formatJSONResponse } from 'shared-lib';
import ProductsRepo from '../../products.repo';

let pool;
const productRepo = new ProductsRepo();

const getProductsList = async () => {
  if (!pool) {
    pool = new Pool(dbConfig);
  }

  const client = await pool.connect();
  productRepo.setClient(client);

  try {
    const products = await productRepo.findMany();

    return formatJSONResponse({ response: products });
  } catch (e) {
    return formatJSONResponse({ statusCode: 500, response: e.message });
  } finally {
    client.release();
  }
}

export const main = middyfy(getProductsList);

export default getProductsList;