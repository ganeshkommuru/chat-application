const users = []

const addUser = ({id,username,room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return {
            error: 'please provide username and room'
        }
    }

    const existingUser = users.find((user) => {
        return user.username === username && user.room === room
    })

    if(existingUser){
        return {
            error: 'user is already in use'
        }
    }
    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const usersInRoom = []
    users.forEach((user) =>{
        if(user.room === room){
            usersInRoom.push(user)
        }
    })
    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom

}