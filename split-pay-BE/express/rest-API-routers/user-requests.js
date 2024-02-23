const express = require('express')
const router = express.Router(); 
const pool = require('../pool.js') 
router.post('/', (req, res) => {
  //parse request body! 
  const body = req.body; 
  const {userID, isLeader, hasAcceptedTerms, amountOwed, userName, email, groupID} = body; 
  const query = 'INSERT INTO Users(userID, isLeader, hasAcceptedTerms, amountOwed, userName, email, groupID) VALUES ($1, $2, $3, $4, $5, $6, $7)'
  const values = [userID, isLeader, hasAcceptedTerms, amountOwed, userName, email, groupID]
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
});

router.get('/:id', (req, res) => {
    //get userId as route param! 
    const userID = req.params.id; 
    const getQuery = `SELECT * FROM Users WHERE userID = $1`
}); 
module.exports = router; 