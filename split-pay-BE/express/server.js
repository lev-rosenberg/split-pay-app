const express = require('express'); 
const pool = require('./pool.js');
const userRouter = require('./rest-API-routers/user-requests.js'); 
const app = express(); 
const port = 8000
/*
//conn pool object for config!
const pool = new Pool({
    user: "postgres",
    host: 'final-project-396.czauaqw2uc55.us-east-2.rds.amazonaws.com',
    database: 'postgres',
    password: "cs396-sjl",
    port: 5432
});*/

app.use(express.json());
//let userRouter defined handler methods handle all API requests coming to '/users'!
app.use('/users', userRouter); 

// pool.query(`CREATE TABLE Users(
//     userID TEXT PRIMARY KEY NOT NULL,
//     isLeader BOOLEAN NOT NULL,
//     hasAcceptedTerms BOOLEAN NOT NULL,
//     amountOwed FLOAT,
//     userName TEXT,
//     email TEXT,
//     groupID TEXT,
//     FOREIGN KEY (groupID) REFERENCES Groups(groupID)
// )`, (err, res) => {
//     if(err) {
//         console.log(`error: ${err}`); 
//     }
//     else{
//         console.log('created users table'); 
//     }
// }); 

/*
Route Name Conventions we will need to handle(REST paradigm APIs; using resource names):
1)/users/
  a.For POST a new user.
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
