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
              (err, response) => {
      if(err) {
          console.log(`error message users: ${err.message}`); 
          res.status(400).send('Error posting user');
      }
      else{
          console.log(`res: ${response}`); 
          res.status(201).send('POST Request!')
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
            res.status(400).send('Error getting user');
        } else{
            console.log(`res: \n`); 
            console.log(response.rows); 
            res.status(200).send(response.rows[0])
        }
    });
}); 

router.put('/:id', (req, res) => {
    const userID = req.params.id; 
    const body = req.body; 
    const {isLeader, hasAcceptedTerms, amountOwed, userName, email} = body; 
    const putQuery = `UPDATE Users
                     SET isLeader = $2, hasAcceptedTerms=$3, amountOwed=$4, userName=$5, email=$6
                     WHERE userID = $1`;
    const values = [userID, isLeader, hasAcceptedTerms, amountOwed, userName, email];
    pool.query(putQuery, values, (err, result) => {
        if(err){
            console.log(err.message); 
            res.status(400).send('Error updating user');
        } else{
            console.log(`put res: ${result}`); 
            res.status(200).send('PUT Request!')
        }
    }); 
});

router.delete('/:id', (req, res) => {
    const userID = req.params.id; 
    const deleteQuery = `DELETE FROM Users WHERE userID = $1`; 
    pool.query(deleteQuery, [userID], (err, response) => {
        if(err){
            console.log(err.message); 
            res.status(400).send('Error deleting user');
        } else{
            console.log(`delete res: ${response}`); 
            res.status(200).send('DELETE Request!')
        }
    }); 
});
module.exports = router; 