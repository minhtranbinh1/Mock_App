const bcrypt = require("bcrypt");
const saltRounds = 10;

function hashPassword(password){
    
    const passwordHashed = bcrypt.hash(password, saltRounds)
    return passwordHashed
}

async function checkPassword(password,storedPassword){
    try {
        const validPassword = await bcrypt.compare(password, storedPassword);
        if(!validPassword) return false;
        return true;
    } catch (error) {
        console.log(error)
    }

}

module.exports = { hashPassword,checkPassword };