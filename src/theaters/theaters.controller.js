const service=require("./theaters.service");


async function list(req,res){
    const {movieId}=req.params;
    req.log.debug({__filename,methodName:"list", movieId});
    if (movieId){
        const result= await service.list(movieId);
        res.json({data:result});
    }
    else{
        const result=await service.list();
        res.json({data:result});
    }
}
module.exports={
    list,
}