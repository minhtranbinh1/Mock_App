const express = require('express');
const app = express();
const env = require('dotenv');
env.config();
const PORT = process.env.PORT || 3001;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// config to MongoDB
const db = require('./config/db/index')
// User controller
const UserController = require('./user/User.controller')
// Authentication
const VerifyToken = require('./middlewares/Auth/Auth')



// All routes
app.post('/api/user' ,UserController.createUser)
app.post('/api/user/login' ,UserController.login)
app.get('/api/user/info' ,VerifyToken,UserController.getUser)
app.post('/api/user/forgot-password',UserController.forgotPassword)
app.put('/api/user/reset-password',UserController.resetPassword)



app.listen(PORT, ()=>{
    console.log('listening on port ' + PORT);
    db.connect();
})
