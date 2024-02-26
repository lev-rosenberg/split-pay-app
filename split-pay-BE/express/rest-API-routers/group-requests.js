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
          res.status(400).json({error: err.message}); 
      }
      else {
          const getNewInsertedGroupQuery = `SELECT * FROM Groups WHERE groupID = $1`
          pool.query(getNewInsertedGroupQuery, [groupID]).then(result => {
            const newInsertedGroup = result.rows[0];
            res.status(201).json({message: "Succesfully added new group!", newGroup: newInsertedGroup}); 
          }).catch(err => {
            res.status(404).json({message: "Can't find the newly inserted group!"}); 
          })
      }
  }); 
});

router.get('/', (req, res) => {
    const query = `SELECT * FROM Groups`;
    pool.query(query, (err, result) => {
        if (err) {
            console.log(err.message); 
            res.status(400).json({error: err.message}); 
        } else {
            console.log(`res: ${result.rows}`);
            res.status(200).json({message: "Succesfully got all groups!", groups: result.rows})
        }
    });
});

router.get('/:id', (req, res) => {
    const groupID = req.params.id; 
    const getGroupQuery = `SELECT * FROM Groups WHERE groupID = $1`
    pool.query(getGroupQuery, [groupID], (err, result) => {
        if(err){
            console.log(err.message); 
            res.status(400).json({error: err.message}); 
        } else {
            console.log(`res: ${result.rows[0]}`); 
            // if(!result.rows[0]){
            //     res.status(404).json({error: `No group with id: ${groupID} found!`}); 
            // }
            res.status(200).json({message: "Succesfully got group!", group: result.rows[0]})
        }
    }); 
});

router.put('/:id', (req, res) => {
    //get groupID route parameter from url! 
    const groupID = req.params.id;
    const body = req.body;
    //destructure from request body the updated field values! 
    const {leaderID, groupName, hasEveryoneAcceptedTerms, totalOwed} = body; 
    const putGroupQuery = `UPDATE Groups
                           SET leaderID = $2, groupName=$3, hasEveryoneAcceptedTerms=$4, totalOwed=$5
                           WHERE groupID = $1`;
    const selectQuery = `SELECT * FROM Groups WHERE groupID = $1`; 
    const values = [groupID, leaderID, groupName, hasEveryoneAcceptedTerms, totalOwed];
    pool.query(selectQuery, [groupID]).then((result) => {
        if(result.rows.length){
            pool.query(putGroupQuery, values).then( _ => {
                pool.query(selectQuery, [groupID]).then(result => {
                    res.status(200).json({message: "Updated group successfully!", newGroup: result.rows[0]})
                }).catch(err => res.status(400).json({error: err.message})); 
        }).catch(err => res.status(400).json({error: err.message})); 
        } else{
            res.status(404).json({error: "Can't find group to update!"}); 
        }
    }).catch(err => res.status(400).json({error: err.message})); 
    
});

router.delete('/:id', (req , res) => {
    //extract groupID from named route parameter to identify group to delete! 
    const groupID = [req.params.id]; 
    const selectQuery = `SELECT * FROM Groups WHERE groupid = $1`
    pool.query(selectQuery, groupID).then((result) => {
        const deletedObj = result.rows[0];
        if(!result.rows.length){
            res.status(404).json({message: "Can not find group with matching group ID to delete!"}); 
            return; 
        }
        const deleteQuery = `DELETE FROM Groups WHERE groupid = $1`
        pool.query(deleteQuery, groupID).then((result) => {
            res.status(200).json({message: "Deleted the group successfully!", deletedGroup: deletedObj}); 
        }).catch(err => {
            console.log(err.message)
            res.status(400).json({message: "Can't delete the group!"}); 
        }); 
    }).catch(err => {
        console.log(err.message)
        res.status(404).send(err.message); 
    }); 
}); 

module.exports = router; 