const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const {getTimeStamp,getTimeStampForLocation } = require('./utils/time_helpers')
const { getUser,getUsersInRoom,removeUser,addUser } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket) => {
    console.log('new web socket connection')

    socket.on('join',({username,room},callback)=>{
        const { error,user } = addUser({id:socket.id,username,room})
        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message',getTimeStamp('Admin' , `welcome!!! ${user.username} `))
        socket.broadcast.to(user.room).emit('message',getTimeStamp('Admin',`A new user has joined ${user.username}`))

        socket.emit('roomUsers',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()

        // socket.emit io.emit socket.broadcast.emit
        // io.to.emit socket.broadcast.to.emit
    })

    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('message',getTimeStamp(user.username,message))
        callback()
    })

    socket.on('sendLocation',(locationObject,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',getTimeStampForLocation( user.username, `https://google.com/maps?q=${locationObject.latitude},${locationObject.longitude}`))
        callback()
    })

    socket.on('disconnect',() =>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',getTimeStamp('Admin',`${user.username} has left ${user.room}`))
            socket.emit('roomUsers',{
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port,() => {
    console.log(`server is up on ${port}`)
})