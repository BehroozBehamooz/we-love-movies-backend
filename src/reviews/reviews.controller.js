const service=require("./reviews.service");
const asyncFunctionErrorHandler=require("../errors/asyncFunctionErrorHandler");

function bodyHasData(req,res,next){
    req.log.debug(__filename,methodName="hasBodyProperty");
    const { data } = req.body;
    if (!data){
        return next({
            status:400,
            message:"Must have a body."
        });
    }
    next();
}

async function reviewExists(req,res,next){
    req.log.debug(__filename,methodName="reviewExists");
    const { reviewId } = req.params;
    const result=await service.read(reviewId);
    if (!result.length){
        return next({
            status:404,
            message:"Review cannot be found."
        });
    }
    res.locals.foundReview=result;
    next();
}

function read(req,res){
    res.json({data:res.locals.foundReview});
}

async function update(req,res){
    req.log.debug(__filename,methodName="update");
    const result=await service.update(req.params.reviewId,req.body.data);
    res.json({data:result});
}

async function destroy(req,res){
    req.log.debug(__filename,methodName="destroy");
    await service.delete(req.params.reviewId);
    res.sendStatus(204);
}

async function list(req,res){
    req.log.debug(__filename,methodName="list");
    const {movieId}=req.params;
    if (movieId){
        const result=await service.list(movieId);
        res.json({data:result});
    }
    else{
        const result=await service.list();
        res.json({data:result});
    }
}

module.exports={
    read:[asyncFunctionErrorHandler(reviewExists), read],
    update:[asyncFunctionErrorHandler(reviewExists), 
        bodyHasData,
        asyncFunctionErrorHandler(update)],
    delete:[asyncFunctionErrorHandler(reviewExists), asyncFunctionErrorHandler(destroy)],
    list,
}