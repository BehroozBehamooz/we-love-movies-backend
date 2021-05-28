function methodNotAllowed(req,res,next){
    return next({
        status:405,
        message:`Method not allowed: ${req.method} for path: ${req.originalUrl}`,
    });
}

module.exports=methodNotAllowed;