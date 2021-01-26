const jwt = require('jsonwebtoken');
module.exports = auth = (req, res, next) => {
    var token = req.body.token || req.headers['authorization'];
    console.log('token');
    console.log(process.env.SECRET);
    console.log(process.env.TOKEN_EXP);
    console.log(token);
    if(token) {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if(err) {
                return res.status(400).json({
                    message: err
                })
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        return res.status(400).json({
            success: false,
            message: 'Unauthorized access'
        });
    }
};