import getProductsById from './handler';
import products from '../../shared/mock/products';

test('getProductsById', async () => {
  const event = {
    pathParameters: {
      productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
    }
  };

  const { body, statusCode } = await getProductsById(event);

  expect(statusCode).toEqual(200);
  expect(JSON.parse(body)).toEqual(products[0]);
});