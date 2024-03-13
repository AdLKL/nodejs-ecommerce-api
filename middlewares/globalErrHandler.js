export const globalErrHandler = (err, req, res, next) => {
    // stack
    // message
    const stack = err?.stack;
    const statusCode = err?.statusCode ? err?.statusCode : 500;
    // 500 is the default status code for internal server errors.
    const message = err?.message;

    res.status(statusCode).json({
        stack,
        message,
    });
};


// 404 handler
export const notFound = (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    next(err); // next middleware
}