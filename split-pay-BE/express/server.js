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
  });
  ws.send(JSON.stringify({event: 'connected', message: "Websocket conn established..."})); 
}); 
app.use(express.json());
// app.use(cors())
app.use(cors({
  origin: 'http://localhost:3000',
})); 
//let userRouter defined handler methods handle all API requests coming to '/users'!
app.use('/users', usersRouter); 
app.use('/groups', groupsRouter); 
app.use('/groupMembers', groupMembersRouter); 

/*
Route Name Conventions we will need to handle(REST paradigm APIs; using resource names):
1)/users/
  a.For POST a new user. (Done)
2)/users/{userID}
  a.Route for updating fields of user with userID = route param! 
3)/groups/
  a.POST request to create new group upon leader triggering it! 
4)/groups/{groupID}
a.DELETE request to identify specific group to delete! */
/*
Requests we will need to handle:
use case: group leader creates a new group
  - POST request to add group to the Groups table
/users/
use case: when a user clicks on link?
  - POST request to add a user to the database (if they aren't in it already) or PUT request to update their info (ie new group ID, new amount owed, etc.)

use case: when leader is setting payment page:
- PUT requests to update amount owed for each user
- PUT request to update group info (ie total amount owed, etc.)

use case: when payment is done:
  - DELETE request to remove group from the Groups table

use case: when user accepts terms:
  - PUT request to update hasAcceptedTerms for a user 
    - this is important for the websocket listener

use case: when to set that leader can pay:
- GET request to get group info (hasAcceptedTerms)

2. GET request to get users in a group
3. GET reqeust to get info from user:
- hasAcceptedTerms for each user (websocket listens to this!)
- amountOwed for each user
4. PUT request to set hasAcceptedTerms for each user
*/
/*
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})*/

httpServer.listen(port, () => {
  console.log(`server started...`); 
})