import 'source-map-support/register';

import { middyfy } from '../../libs/lambda';
import { formatJSONResponse } from '../../libs/apiGateway';

import { ProductsRepo } from '../../shared/ProductsRepo';

const getProductsList = async () => {
  try {
    const products = await ProductsRepo.getProducts();

    return formatJSONResponse({ response: products });
  } catch (e) {
    return formatJSONResponse({ statusCode: 500, response: e.message });
  }
}

export const main = middyfy(getProductsList);

export default getProductsList;