import getProductsList from './handler';
import products from '../../shared/mock/products';

test('getProductsList', async () => {
  const { body, statusCode } = await getProductsList();

  expect(statusCode).toEqual(200);
  expect(JSON.parse(body)).toEqual(products);
});