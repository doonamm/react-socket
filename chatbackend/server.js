const express = require('express');
const socket = require('socket.io');
const color = require('colors');
const cors = require('cors');
const app = express();
const {get_current_user, user_disconnect, join_user} = require('./dummyuser');

app.use(express());

const port = 8888;

app.use(cors());

const server = app.listen(
    port,
    console.log(
        `Server is running on the port no: ${port}`.green
    )
);

const io = socket(server);
io.on('connection', (socket)=>{
    socket.on('joinRoom', ({username, roomname})=>{
        const p_user = join_user(socket.id, username, roomname);
        console.log(socket.id, '=id');

        socket.join(p_user.room);

        socket.emit('message', {
            userId: p_user.id,
            username: p_user.username,
            text: `Welcome ${p_user.username}`,
        });

        socket.broadcast.to(p_user.room).emit('message', {
            userId: p_user.id,
            username: p_user.username,
            text: `${p_user.username} has joined the chat`,
        });
    });

    socket.on('chat', (text)=>{
        const p_user = get_current_user(socket.id);

        io.to(p_user.room).emit('message', {
            userId: p_user.id,
            username: p_user.username,
            text: text
        });
    });

    socket.on('disconnect', ()=>{
        const p_user = user_disconnect(socket.id);

        if(p_user){
            io.to(p_user.room).emit('message', {
                userId: p_user.id,
                username: p_user.username,
                text: `${p_user.username} has left the room`,
            });
        }
    });
});