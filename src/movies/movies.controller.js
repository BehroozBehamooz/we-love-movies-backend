const service = require("./movies.service");
const asyncFunctionErrorHandler=require("../errors/asyncFunctionErrorHandler");

async function movieExists(req,res,next) {
  const { movieId } = req.params;
  req.log.debug({ __filename, methodName: "movieExists", movieId });
  const foundMovie = await service.read(movieId);
  if (!foundMovie) {
    req.log.trace({__filename, methodName: "movieExists", movieId, value:false});  
    next({
      status: 404,
      message: "Movie cannot be found.",
    });
  }
  req.log.trace({__filename, methodName: "movieExists", movieId, value:true,foundMovie,});  
  res.locals.foundMovie=foundMovie;
  return next();
}

async function read(req, res) {
  req.log.debug({ __filename, methodName: "read" });
  res.json({data:res.locals.foundMovie});
}

async function list(req, res) {
  req.log.debug({ __filename, methodName: "list" });
  const { is_showing }=req.query;
  const result = await service.list(is_showing);
  res.json({ data: result });
}

module.exports = {
    read:[movieExists, asyncFunctionErrorHandler(read)],
    list:asyncFunctionErrorHandler(list),
    movieExists:asyncFunctionErrorHandler(movieExists),
};
