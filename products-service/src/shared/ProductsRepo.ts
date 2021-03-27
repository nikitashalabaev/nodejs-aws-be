import products from '../shared/mock/products';

const delay = (cb) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(cb())
    }, 1000);
  });
}

export class ProductsRepo {
  static getProducts() {
    return delay(() => products);
  }

  static getProductsById(productId) {
    return delay(() => {
      const product = products.find(({ id }) => id === productId);
  
      if (!product) throw new Error('No product found');
  
      return product;
    });
  }
}

