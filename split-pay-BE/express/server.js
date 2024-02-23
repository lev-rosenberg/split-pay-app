const express = require('express'); 
const {Pool} = require('pg'); 
const app = express(); 
const port = 8000

//conn pool object for config!
const pool = new Pool({
    user: "postgres",
    host: 'final-project-396.czauaqw2uc55.us-east-2.rds.amazonaws.com',
    database: 'postgres', //this is the initial db identifier
    password: "cs396-sjl",
    port: 5432
});

app.use(express.json());

pool.query(`CREATE TABLE Groups(
  groupID TEXT PRIMARY KEY NOT NULL,
  leaderID TEXT,
  groupName TEXT,
  hasEveryoneAcceptedTerms BOOLEAN,
  totalOwed FLOAT
);`, (err, res) => {
    if(err){
        console.log(`error: ${err}`); 
    }
    else{
        console.log('created users table'); 
    }
}); 

app.post('/', (req, res) => {
    //parse request body! 
    const body = req.body; 
    const {userID, isLeader, hasAcceptedTerms, amountOwed, userName, email} = body; 
    const insertQuery =
     `INSERT INTO Users(userID, isLeader, hasAcceptedTerms, amountOwed, userName, email) VALUES(
        ${userID}, ${isLeader}, ${hasAcceptedTerms}, ${amountOwed}, ${userName}, ${email}
      )`;
    const query = 'INSERT INTO Users(userID, isLeader, hasAcceptedTerms, amountOwed, userName, email) VALUES ($1, $2, $3, $4, $5, $6)'
    const values = [userID, isLeader, hasAcceptedTerms, amountOwed, userName, email]
    pool.query(query,
                values, 
                (err, res) => {
        if(err){
            console.log(`error message: ${err.message}`); 
        }
        else{
            console.log(`res: ${res}`); 
        }
    }); 
    res.send('POST Request!')
})

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
