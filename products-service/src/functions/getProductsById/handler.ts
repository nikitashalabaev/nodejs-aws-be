import 'source-map-support/register';

import { Pool } from 'pg';
import dbConfig from '../../dbConfig';
import { middyfy, formatJSONResponse } from 'shared-lib';
import ProductsRepo from '../../products.repo';

let pool;
const productRepo = new ProductsRepo();

const getProductsById = async (event) => {
  if (!pool) {
    pool = new Pool(dbConfig);
  }

  const client = await pool.connect();
  productRepo.setClient(client);

  try {
    const { productId } = event.pathParameters;

    const product = await productRepo.findOne(productId);

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