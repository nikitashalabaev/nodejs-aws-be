import { handlerPath } from 'shared-lib';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: {
          'Fn::GetAtt': ['CatalogItemsQueue', 'Arn']
        }
      }
    }
  ]
}
