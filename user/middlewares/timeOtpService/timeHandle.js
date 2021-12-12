function createExpiredOTP(time,seconds){ 
    const date = new Date(time);
    return new Date(Date.parse(date) + seconds*1000);
}

function isExpiredOTP(updatedAt){
    const datenow = parseInt(Date.now())
    const date = new Date(updatedAt)
    const expired = createExpiredOTP(date,60)
    if(Date.parse(expired) <= datenow){
        return true;
    }
    return false;
}
module.exports = { createExpiredOTP,isExpiredOTP }
