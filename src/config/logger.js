require("dotenv").config();
const pinoHttp=require("pino-http");
const {nanoid}=require("nanoid");

const prettyPrint= process.env.NODE_ENV === "development";
const level=process.env.LOG_LEVEL || "info";
const logger=pinoHttp({
    genReqId : (req)=> req.headers["x-request-id"] || nanoid(),
    level,
    prettyPrint,
});

module.exports=logger;