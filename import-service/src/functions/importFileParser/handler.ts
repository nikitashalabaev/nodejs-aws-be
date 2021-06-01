import 'source-map-support/register';
import { S3, SQS } from 'aws-sdk';
import csv from 'csv-parser';

import { BUCKET, PARSED_PATH, REGION, UPLOADED_PATH } from '../../../constants';

const getObjectKey = (event) => decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

const importFileParser = async (event) => {
  try {
    const s3 = new S3({
      region: REGION,
    });

    const sqs = new SQS();
  
    const sourceKey = getObjectKey(event);
    const destinationKey = sourceKey.replace(UPLOADED_PATH, PARSED_PATH);
  
    const getParams = {
      Bucket: BUCKET,
      Key: sourceKey,
    };
  
    const copyParams = {
      Bucket: BUCKET,
      Key: destinationKey,
      CopySource: `${BUCKET}/${sourceKey}`,
    };
  
    const getObjectStream = s3
      .getObject(getParams)
      .createReadStream();
  
    getObjectStream
      .pipe(csv())
      .on('data', (data) => {
        console.log(data);

        sqs.sendMessage({
          QueueUrl: process.env.CatalogItemsQueueUrl,
          MessageBody: JSON.stringify(data),
        }, () => {
          console.log('Message sent');
        });
      });
  
    await s3.copyObject(copyParams).promise();
    return s3.deleteObject(getParams).promise();
  } catch (error) {
    console.log(error);
  }
}

export const main = importFileParser;