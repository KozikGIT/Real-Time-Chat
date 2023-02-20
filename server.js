//npm run dev
const path=require('path');
const http= require('http');
const express=require('express'); //serwer
const socketio=require('socket.io');
const formatMessage=require('./utilz/messages')
const {userJoin,getCurrentUser, userLeave, getRoomUsers}=require('./utilz/users');

const app=express(); 
const server=http.createServer(app);
const io=socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName="Patryk Bot"
//Run when player connects
io.on('connection',socket=>{
    socket.on('joinRoom',({username,room})=>{  
        const user=userJoin(socket.id,username,room);
        socket.join(user.room);
        socket.emit('message',formatMessage(botName,'Welcome to Chat')) //single client (who is already connecting)

//Brodcast when user connects
socket.broadcast.emit('message',formatMessage(botName,`${user.username} has joined the chat`)); //all clients who are connected
//io.emit();//all clients

io.to(user.room).emit('roomUsers',
{
    room: user.room,
    users:getRoomUsers(user.room)})
})
  

    //Listen for chatMessage
    socket.on('chatMessage',msg=>{
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));})


//User disconected
socket.on('disconnect',()=>{
    const user=userLeave(socket.id);
    if(user)
    {
        io.emit('message',formatMessage(botName,` ${user.username} left the chat`));

        io.to(user.room).emit('roomUsers',
{
    room: user.room,
    users:getRoomUsers(user.room)})
    }
    
});


});

const PORT=3000 || process.env.PORT;

server.listen(PORT, ()=> console.log('server running on port '+ PORT));