function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
        return (true)
    }
    return (false)
}
function ValidatePassword(password,confirmPassword){
    if(password !== confirmPassword) return false
    return true;
}
function ValidateUsername(username){
    if(username.length > 5) return true
    return false
}

module.exports = {
    ValidateEmail,
    ValidatePassword,
    ValidateUsername
}