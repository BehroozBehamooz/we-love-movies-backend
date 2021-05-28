function errorHandler(error,req,res,next){
    const {message="internal server error" ,status=500}=error;
    res.status(status).json({error:message});
}

module.exports=errorHandler;