import type { AWS } from '@serverless/typescript';
import { BUCKET } from './constants'
import importProductsFile from './src/functions/importProductsFile';
import importFileParser from './src/functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
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
      CatalogItemsQueueUrl: { 'Fn::ImportValue': 'CatalogItemsQueueUrl' },
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        statements: [{
          Effect: 'Allow',
          Action: 's3:ListBucket',
          Resource: `arn:aws:s3:::${BUCKET}`
        },{
          Effect: 'Allow',
          Action: 's3:*',
          Resource: `arn:aws:s3:::${BUCKET}/*`
        }, {
          Effect: 'Allow',
          Action: 'sqs:*',
          Resource: { 'Fn::ImportValue': 'CatalogItemsQueueArn' },
        }],
      },
    },
  },
  // import the function via paths
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
