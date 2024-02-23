const express = require('express')
const router = express.Router(); 
const pool = require('../pool.js') 

router.post('/', (req, res) => {
  //parse request body! 
  const body = req.body; 
  const {groupID, leaderID, groupName, hasEveryoneAcceptedTerms, totalOwed} = body; 
  console.log(`groupID: ${groupID}`); 
  const query = 'INSERT INTO Groups(groupID, leaderID, groupName, hasEveryoneAcceptedTerms, totalOwed) VALUES ($1, $2, $3, $4, $5)'
  const values = [groupID, leaderID, groupName, hasEveryoneAcceptedTerms, totalOwed]
  pool.query(query,
              values, 
              (err, resp) => {
      if(err){
          console.log(`error message groups: ${err.message}`); 
      }
      else {
          console.log(`resp: ${resp}`); 
          res.status(201).send("Post success!");
      }
  }); 
});

router.get('/:id', (req, res) => {
    const groupID = req.params.id; 
    const getGroupQuery = `SELECT * FROM Groups WHERE groupID = $1`
    pool.query(getGroupQuery, [groupID], (err, res) => {
        if(err){
            console.log(err.message); 
        } else {
            console.log(`res: ${res}`); 
        }
    }); 
});

router.put('/:id', (req, res) => {
    const groupID = req.params.id;
    const body = req.body;
    const {leaderID, groupName, hasEveryoneAccepted, totalOwed} = body; 
    const putGroupQuery = `UPDATE Groups
                           SET leaderID = $2, groupName=$3, hasEveryoneAcceptedTerms=$4, totalOwed=$5
                           WHERE groupName = $1`;
    values = [groupID, leaderID, groupName, hasEveryoneAcceptedTerms, totalOwed];
    pool.query(putGroupQuery, values, (err, result) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log( `res: ${res}`);
        }
    });
});

module.exports = router; 