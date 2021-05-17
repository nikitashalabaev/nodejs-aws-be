import { handlerPath } from 'shared-lib';
import { BUCKET, UPLOADED_PATH } from '../../constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET,
        event: 's3:ObjectCreated:Put',
        existing: true,
        rules: [{
          prefix: UPLOADED_PATH,
        }],
      },
    },
  ],
}
