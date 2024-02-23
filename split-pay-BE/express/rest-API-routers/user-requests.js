const express = require('express')
const router = express.Router(); 
const pool = require('../pool.js') 
router.post('/', (req, res) => {
    console.log("handler for posting user triggered!"); 
  //parse request body! 
  const body = req.body; 
  const {userID, isLeader, hasAcceptedTerms, amountOwed, userName, email} = body; 
  const query = 'INSERT INTO Users(userID, isLeader, hasAcceptedTerms, amountOwed, userName, email) VALUES ($1, $2, $3, $4, $5, $6)'
  const values = [userID, isLeader, hasAcceptedTerms, amountOwed, userName, email]
  pool.query(query,
              values, 
              (err, result) => {
      if(err){
          console.log(`error message users: ${err.message}`); 
          res.status(400).send(err.message); 
      }
      else{
          const getNewInsertedQuery = `SELECT * FROM Users WHERE userID = $1`
          pool.query(getNewInsertedQuery, [userID]).then(result => {
            console.log(result);
            res.status(201).send(result.rows[0]);
          }).catch(err => {
            res.status(400).send("Can't add a new user!"); 
          });
      }
  }); 
});

router.get('/:id', (req, res) => {
    //get userId as route param! 
    const userID = req.params.id; 
    const getQuery = `SELECT * FROM Users WHERE userID = $1`
    pool.query(getQuery, [userID], (err, response) => {
        if(err){
            console.log("error message users: " + err.message); 
            res.status(400).send("Bad request to get a user!"); 
        } else{
            console.log(`res: \n`); 
            console.log(response.rows[0]); 
            if(!response.rows.length){
                res.status(404).send(`User with id: ${userID} not found!`); 
            }
            res.status(200).send(response.rows[0])
        }
    })
}); 
module.exports = router; 