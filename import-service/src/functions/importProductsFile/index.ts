import { handlerPath } from 'shared-lib';


export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
      }
    }
  ],
}
