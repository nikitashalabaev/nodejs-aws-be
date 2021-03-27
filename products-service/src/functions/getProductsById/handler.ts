import 'source-map-support/register';

import { middyfy } from '../../libs/lambda';
import { formatJSONResponse } from '../../libs/apiGateway';

import { ProductsRepo } from '../../shared/ProductsRepo';

const getProductsById = async (event) => {
  try {
    const { productId } = event.pathParameters;

    const product = await ProductsRepo.getProductsById(productId);

    return formatJSONResponse({ response: product });
  } catch (e) {
    return formatJSONResponse({ statusCode: 500, response: e.message });
  }
}

export const main = middyfy(getProductsById);

export default getProductsById;