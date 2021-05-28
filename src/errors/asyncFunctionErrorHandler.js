function asyncFunctionErrorHandler(delegate,defaultStatus=500){
    return (req,res,next)=>{
        req.log.debug({__filename,methodName:"asyncFunctionErrorHandler"});
        try{
            delegate(req,res,next);
        }
        catch(error){
            req.log.trace({__filename,methodName:"asyncFunctionErrorHandler",error,});
            const {status=defaultStatus, message="Internal Server Error"}=error;
            next({
                status,
                message
            });
        }
    }
}

module.exports=asyncFunctionErrorHandler;