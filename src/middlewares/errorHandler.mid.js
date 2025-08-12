const errorHandler = (err,req,res,next) => {
    console.error(err)
    const error = err.message || "Server Error"
    const statusCode = err.statusCode || 500
    const {method,originalUrl:URL} = req
    res.status(statusCode).json({error,method,URL})
}

export default errorHandler