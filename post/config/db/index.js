const mongoose = require('mongoose');
const url = process.env.URL_MONGODB

async function connect(){
    try {
         await mongoose.connect(url,
         { 
             useNewUrlParser: true, 
             useUnifiedTopology: true 
         });
          console.log('Connected')
          
    } catch (error) {
            console.log('Error connecting');
    }
}

module.exports = { connect };