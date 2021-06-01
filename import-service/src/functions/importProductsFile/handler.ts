import 'source-map-support/register';
import { S3 } from 'aws-sdk';
import { middyfy, formatJSONResponse } from 'shared-lib';

import { BUCKET, REGION, UPLOADED_PATH } from '../../../constants';

const importProductsFile = async (event) => {
  try {
    const { name } = event.queryStringParameters;

    const s3 = new S3({
      region: REGION,
    });
  
    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: BUCKET,
      Key: `${UPLOADED_PATH}/${name}`,
      ContentType: 'text/csv',
      Expires: 60,
    });

    return formatJSONResponse({ response: signedUrl });
  } catch (error) {
    return formatJSONResponse({ statusCode: 500, response: error.message });
  }
}

export const main = middyfy(importProductsFile);

export default importProductsFile;