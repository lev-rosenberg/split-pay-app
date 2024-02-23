const express = require('express')
const router = express.Router(); 
const pool = require('../pool.js') 

router.post('/', (req, res) => {
  //parse request body! 
  const body = req.body; 
  const {groupID, leaderID, groupName, hasEveryoneAccepted, totalOwed} = body; 
  const query = 'INSERT INTO Groups(groupID, leaderID, groupName, hasEveryoneAccepted, totalOwed) VALUES ($1, $2, $3, $4, $5, $6, $7)'
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

router.get('/', (req, res) => {

});

module.exports = router; 