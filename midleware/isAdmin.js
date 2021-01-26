const jwt = require('jsonwebtoken');
module.exports = isAdmin = (req, res, next) => {
    var token = req.body.token || req.headers['authorization'];
    if(token) {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if(err) {
                return res.status(201).json({
                    success: false,
                    message: err
                });
            } else {
                var user = decoded._doc;
                console.log(user);
                if( user.userType == 'admin' ) {
                    req.decoded = decoded;
                    next();
                } else {
                    return res.status(201).json({
                        success: false,
                        message: 'Invalid Admin'
                    });
                }
            }
        });
    } else {
        return res.status(201).json({
            success: false,
            message: 'Invalid Admin credentials'
        });
    }
};