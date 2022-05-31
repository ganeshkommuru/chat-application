const getTimeStamp = (username , message) => {
    return {
        username,
        message,
        time: new Date().getTime(),
    }
}

const getTimeStampForLocation = (username,url) => {
    return {
        username,
        url,
        time: new Date().getTime(),
    }
}

module.exports={
    getTimeStamp,
    getTimeStampForLocation
}