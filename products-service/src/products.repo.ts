const getProductsQueryValues = (products) =>
  products.map(({ title, description, price }) => `('${title}', '${description}', ${Number(price)})`);

const getStocksQueryValues = (products, ids) =>
  products.map(({ count }, id) => `('${ids[id]}', '${Number(count)}')`);

class ProductsRepo {
  client: any;

  setClient(client) {
    this.client = client;
  }

  async findMany() {
    const { rows } = await this.client.query(`
      SELECT id, title, description, price, count FROM products p LEFT JOIN stocks s ON p.id = s.product_id
    `);

    return rows;
  }

  async findOne(id) {
    const { rows: [product] } = await this.client.query(`
      SELECT id, title, description, price, count FROM products p LEFT JOIN stocks s ON p.id = s.product_id WHERE id='${id}' 
    `);

    return product;
  }

  async create(product) {
    const { title, description, price, count } = product;

    const products = await this.client.query(`
      INSERT INTO products (title, description, price) VALUES ('${title}', '${description}', ${Number(price)}) RETURNING id
    `);

    const productID = products.rows[0].id;

    await this.client.query(`
      INSERT INTO stocks (product_id, count) VALUES ('${productID}', '${Number(count)}')
    `);
  }

  async createMany(products) {
    const productsQuery = await this.client.query(`
      INSERT INTO products (title, description, price) VALUES ${getProductsQueryValues(products)} RETURNING id
    `);

    const productsIDs = productsQuery.rows.map(({ id }) => id);

    await this.client.query(`
      INSERT INTO stocks (product_id, count) VALUES ${getStocksQueryValues(products, productsIDs)}
    `);
  }
  seed() {}
}

export default ProductsRepo;
