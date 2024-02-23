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
              (err, result) => {
      if(err){
          console.log(`error message groups: ${err.message}`); 
          res.status(400).send('Error posting group');
      }
      else {
          console.log(`result: ${result}`); 
          res.status(201).send("Post success!");
      }
  }); 
});

router.get('/:id', (req, res) => {
    const groupID = req.params.id; 
    const getGroupQuery = `SELECT * FROM Groups WHERE groupID = $1`
    pool.query(getGroupQuery, [groupID], (err, result) => {
        if (err) {
            console.log(err.message); 
            res.status(400).send('Error getting group');
        } else {
            console.log(`get res: ${result}`); 
            res.status(200).send(result.rows[0])
        }
    }); 
});

router.put('/:id', (req, res) => {
    const groupID = req.params.id;
    const body = req.body;
    const {leaderID, groupName, hasEveryoneAcceptedTerms, totalOwed} = body; 
    const putGroupQuery = `UPDATE Groups
                           SET leaderID = $2, groupName=$3, hasEveryoneAcceptedTerms=$4, totalOwed=$5
                           WHERE groupID = $1`;
    values = [groupID, leaderID, groupName, hasEveryoneAcceptedTerms, totalOwed];
    pool.query(putGroupQuery, values, (err, result) => {
        if (err) {
            console.log(err.message);
            res.status(400).send('Error updating group');
        } else {
            console.log(`put res: ${result}`);
            res.status(200).json({ message: 'Group updated successfully' });
        }
    });
});

router.delete('/:id', (req, res) => {
    const groupID = req.params.id;
    const deleteGroupQuery = `DELETE FROM Groups WHERE groupID = $1`;
    pool.query(deleteGroupQuery, [groupID], (err, response) => {
        if (err) {
            console.log(err.message);
            res.status(400).send('Error deleting group');
        } else {
            console.log(`delete res: ${response}`);
            res.status(200).send('DELETE Request!')
        }
    });
});

module.exports = router; 