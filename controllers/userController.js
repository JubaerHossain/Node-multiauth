const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const validateRegister = require('../validations/register');
const User = require('../models/userModel');
let createUser = (req, res, next) => {
     console.log('req.body');
     console.log(req.body);
    const { errors, isValid } = validateRegister(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }
        User.findOne({
            email: req.body.email
        }).then(user => {
            if(user) {
                return res.status(400).json({
                    email: 'Email already exists'
                });
            }
            else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar,
                    userType:'customer'
                });
                
                bcrypt.genSalt(10, (err, salt) => {
                    if(err) console.error('There was an error', err);
                    else {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) console.error('There was an error', err);
                            else {
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        res.json(user)
                                    }); 
                            }
                        });
                    }
                });
            }
        });
};

module.exports = {
    createUser,
}