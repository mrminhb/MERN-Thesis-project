const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    // console.log(authHeader)
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if(err) {
                res.status(403).json("Invalid token")
            } else {
                req.user = user;
                next();
            }

        })
    } else {
        return res.status(401).json("User not authenticated!")
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {

    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Invalid authorization")
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {

    verifyToken(req, res, () => {
        if(req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Invalid authorization" + req.user)
        }
    })
}

module.exports = { 
    verifyToken, 
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin 
}