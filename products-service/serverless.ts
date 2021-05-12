import type { AWS } from '@serverless/typescript';

import getProductsList from './src/functions/getProductsList';
import getProductsById from './src/functions/getProductsById';
import createProduct from './src/functions/createProduct';
import seedProductsService from './src/functions/seedProductsService';

const serverlessConfiguration: AWS = {
  service: 'products-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: '',
      PG_PORT: '',
      PG_DATABASE: '',
      PG_USERNAME: '',
      PG_PASSWORD: '',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct, seedProductsService },
};

module.exports = serverlessConfiguration;
