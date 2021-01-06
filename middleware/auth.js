//Import JWT -work with web tokens
const jwt = require('jsonwebtoken');

//Import config data from config/default.json
const config = require('config');


module.exports = function (req, res, next){
    //Get the token from the header
    const token = req.header('x-auth-token');

    //Check if NO ANY TOKEN
    if(!token){
        return res.status(401).json({msg: 'No token. Authorization denied'});
    }

    //Verify the token
    try{
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    }catch(err){
        res.status(401).json({msg: 'Token is not valid'});
    }
}