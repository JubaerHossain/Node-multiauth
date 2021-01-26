const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateRegister = require('../validations/register');
const validateLogin = require('../validations/login');
const User = require('../models/userModel');

let createUser = (req, res, next) => {
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

let login = (req, res, next) => {
    const { errors, isValid } = validateLogin(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {
                                id: user.id,
                                name: user.name,
                                avatar: user.avatar
                            }
                            jwt.sign(payload, process.env.SECRET, {
                                expiresIn: 36000
                            }, (err, token) => {
                                if(err) console.error('There is some error in token', err);
                                else {
                                    res.json({
                                        success: true,
                                        token: token,
                                        user:user
                                    });
                                }
                            });
                        }
                        else {
                            errors.password = 'Incorrect Password';
                            return res.status(400).json(errors);
                        }
                    });
        });
};

let users = (req, res, next) => { 
    User.find( (err, User) => {
        if(err){
            return res.status(404).json({
                message: err,
                success: false
            });
        }
        else {
            return res.status(200).json({
                success: true,
                data: User
            });
        }
    });
}

module.exports = {
    createUser,
    users,
    login
}