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
          res.status(400).send("Couldn't add a new group!"); 
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
        if(err){
            console.log(err.message); 
            res.status(400).send("Bad request to get a group by client!"); 
        } else {
            console.log(`res: ${result.rows[0]}`); 
            if(!result.rows[0]){
                res.status(404).send(`No group with id: ${groupID} found!`); 
            }
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
    const values = [groupID, leaderID, groupName, hasEveryoneAccepted, totalOwed];
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
            const getUpdatedUserQuery = `SELECT * FROM Groups WHERE groupID = $1`;
            pool.query(getUpdatedUserQuery, [groupID]).then(result => {
                const updatedGroup = result.rows[0]
                console.log(updatedGroup);
                res.status(200).send(updatedGroup);
            }).catch(err => {
                console.log(err.message); 
            }); 
        }
    });
});

router.delete('/:id', (req , res) => {
    //extract groupID from named route parameter to identify group to delete! 
    const groupID = [req.params.id]; 
    const selectQuery = `SELECT * FROM Groups WHERE groupid = $1`
    pool.query(selectQuery, groupID).then((result) => {
        const deletedObj = result.rows[0];
        const deleteQuery = `DELETE FROM Groups WHERE groupid = $1`
        pool.query(deleteQuery, groupID).then((result) => {
            console.log(`deleted group with id: ${groupID}\n`);
            console.log(deletedObj); 
            res.status(200).send(deletedObj); 
        }).catch(err => {
            console.log(err.message)
            res.status(400).send("Can't delete!")
        }); 
    }).catch(err => {
        console.log(err.message)
        res.status(404).send("Can't find group to delete!"); 
    }); 
}); 

module.exports = router; 