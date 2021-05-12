import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import cors from "@middy/cors";

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser()).use(cors());
}
