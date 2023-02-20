const chatForm= document.getElementById('chat-form')
const chatMessages=document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//get usarname and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

const socket= io();

//join room
socket.emit('joinRoom',{username,room})

socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputusers(users);
})

//message from server
socket.on('message',message=>
{
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop=chatMessages.scrollHeight;
});

console.log(username,room)



//Message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    //get message text
    const msg=e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage',msg);
    //Clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

});
//output message to DOM
function outputMessage(message)
{
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p><p class="text"> ${message.text}</p>`;
    
    document.querySelector('.chat-messages').appendChild(div)
}


//Ad room name to DOM
function outputRoomName()
{
    roomName.innerText=room;

}

function outputusers(users)
{
    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}`
}