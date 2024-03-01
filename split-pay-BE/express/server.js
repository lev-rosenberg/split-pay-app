const express = require('express'); 
const http = require('http');
const cors = require('cors');
const WebSocket = require('ws'); 
const pool = require('./pool.js');
const usersRouter = require('./rest-API-routers/user-requests.js'); 
const groupsRouter = require('./rest-API-routers/group-requests.js')
const groupMembersRouter= require('./rest-API-routers/group-members-requests.js');
const app = express(); 
const httpServer = http.createServer(app); 
//instantiate web socket server instance! 
const wss = new WebSocket.Server({server: httpServer}); 
const port = 8000
//register handlers on web-socket! 
wss.on('connection', (ws) => {
  console.log(`new client connected!`);
  ws.on('message', (msg) =>{
    const data = JSON.parse(msg); 
    //check if received websocket event is initiate-payment! 
    if(data.event === 'initiate-payment'){
      console.log(`received initiation of payment from: ${data.groupid}`);
       //now broadcast the update event so that every member of group can see how much they owe for real-time! 
      wss.clients.forEach(client => client.send(JSON.stringify({event: 'update'}))); 
    }
    if(data.event === 'status-changed'){
      console.log(`received status change for user: ${data.userid}`)
      wss.clients.forEach(client => client.send(JSON.stringify({event: 'update'}))); 
    }
  });
  ws.send(JSON.stringify({event: 'connected', message: "Websocket conn established..."})); 
}); 
app.use(express.json());
// app.use(cors())
app.use(cors({
  origin: 'http://localhost:3000, https://split-pay.onrender.com',
})); 
//let userRouter defined handler methods handle all API requests coming to '/users'!
app.use('/users', usersRouter); 
app.use('/groups', groupsRouter); 
app.use('/groupMembers', groupMembersRouter); 

httpServer.listen(port, () => {
  console.log(`server started...`); 
})