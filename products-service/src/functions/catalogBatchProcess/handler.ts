
import 'source-map-support/register';

import { SNS } from 'aws-sdk';
import { Pool } from 'pg';
import dbConfig from '../../dbConfig';
import { middyfy, formatJSONResponse } from 'shared-lib';
import ProductsRepo from '../../products.repo';

let pool;
const productsRepo = new ProductsRepo();

const catalogBatchProcess = async (event) => {
  if (!pool) {
    pool = new Pool(dbConfig);
  }

  const client = await pool.connect();
  productsRepo.setClient(client);

  try {
    const products = event.Records.map(({ body }) => JSON.parse(body));

    if (!products.length) return formatJSONResponse({ statusCode: 400, response: 'No products provided' });

    await productsRepo.createMany(products);

    const sns = new SNS();

    sns.publish({
      Message: JSON.stringify(products),
      TopicArn: process.env.CreateProductTopic,
    }, (err) => {
      console.log(err);
      console.log(`Published to the ${process.env.CreateProductTopic}`);
    });

    return formatJSONResponse({ response: 'Products created' });
  } catch (e) {
    return formatJSONResponse({ statusCode: 500, response: e.message });
  } finally {
    client.release();
  }
}

export const main = middyfy(catalogBatchProcess);

export default catalogBatchProcess;