
module.exports = async (ctx, next) => {
    ctx.user = false;

    if (ctx.headers.hasOwnProperty("x-user")) {
        // Client sends in format of `user_id=>environment`
        var user_header = ctx.headers["x-user"].split("=>");

        try {
            ctx.user = {
                "_id": user_header[0].trim(),
                "env": user_header[1].toLowerCase().trim()
            };
        }
        catch (err) {
            // Wrong header format
            ctx.user = false;
        }
    }

    await next();
};
