import type { AWS } from '@serverless/typescript';
import { config } from 'dotenv';

import getProductsList from './src/functions/getProductsList';
import getProductsById from './src/functions/getProductsById';
import createProduct from './src/functions/createProduct';
import seedProductsService from './src/functions/seedProductsService';
import catalogBatchProcess from './src/functions/catalogBatchProcess';

config();

const serverlessConfiguration: AWS = {
  service: 'products-service',
  frameworkVersion: '2',
  useDotenv: true,
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
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: process.env.AWS_NODEJS_CONNECTION_REUSE_ENABLED,
      PG_HOST: process.env.PG_HOST,
      PG_PORT: process.env.PG_PORT,
      PG_DATABASE: process.env.PG_DATABASE,
      PG_USERNAME: process.env.PG_USERNAME,
      PG_PASSWORD: process.env.PG_PASSWORD,
      CreateProductTopic: {
        Ref: 'CreateProductTopic'
      },
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        statements: [{
          Effect: 'Allow',
          Action: 'sns:Publish',
          Resource: {
            Ref: 'CreateProductTopic'
          }
        }],
      },
    },
  },
  resources: {
    Resources: {
      CatalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      CreateProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
          Subscription: [{
            Protocol: 'Email',
            Endpoint: process.env.SNS_EMAIL,
          }],
        },
      },
    },
    Outputs: {
      CatalogItemsQueueUrl: {
        Description: 'Catalog item queue',
        Value: {
          Ref: 'CatalogItemsQueue',
        },
        Export: {
          Name: 'CatalogItemsQueueUrl',
        },
      },
      CatalogItemsQueueArn: {
        Description: 'Catalog item queue arn',
        Value: {
          'Fn::GetAtt': ['CatalogItemsQueue', 'Arn'],
        },
        Export: {
          Name: 'CatalogItemsQueueArn',
        },
      },
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct, seedProductsService, catalogBatchProcess },
  
};

module.exports = serverlessConfiguration;
