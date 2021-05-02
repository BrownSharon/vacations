const jwt = require('jsonwebtoken')

const vt = (req, res, next)=>{
    
    jwt.verify(req.headers.token, "YosiKushiApp", (err, payload)=>{
        if (err){
            console.log(err);
            res.status(401).json({err:true, msg:err})
        }else{
            req.user = payload
            next()
        }
    })
}

module.exports = {vt}