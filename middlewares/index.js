const {to} = require('await-to-js');
const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    let token = req.headers.authorization;
    token = token.split('Bearer ')[1];
    if(data.email){
        next();
    }
    return res.json({
        data: null,
        error: 'invalid token'
    });
};


module.exports = {
    checkToken
};