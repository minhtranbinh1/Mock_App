const axios = require('axios');
async function auth(req, res, next) {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    if(!token) return res.status(401).json({success: false,message: 'Access token not found'})
    try {
        const respone = await axios.post('http://localhost:3001/api/auth', {accessToken: token})
        if(!respone.data.success) return res.status(respone.data.statusCode).json({success: false,message: "Acess token is not available"})
        req.user = respone.data.user
        return next();
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false,message: error})
    }
}
function authorization(req, res, next){
    console.log(req.user)
    if(req.user.role === 'admin' || req.user.role === 'user'){
        return next();
    }
    return res.status(403).json({success: false,message:"You are not authorized to do this"})
}


module.exports = { auth,authorization }