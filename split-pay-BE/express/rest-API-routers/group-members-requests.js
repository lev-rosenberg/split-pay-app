const express = require('express')
const router = express.Router(); 
const pool = require('../pool.js') 

// groupId: "testId" memberId: "lev"
router.post('/', (req,res) => {
    const body = req.body; 
    const {groupID, memberID, isLeader, amountOwed, hasAcceptedTerms} = body
    const values = [groupID, memberID, isLeader, amountOwed, hasAcceptedTerms]
    const insertGroupMemberQuery = `INSERT INTO GroupMembers(groupid, memberid, isleader, amountowed, hasacceptedterms) VALUES($1, $2, $3, $4, $5)`
    pool.query(insertGroupMemberQuery, values, (err, resp) => {
        if(err){
            console.log(`error for inserting a new groupMember: ${err.message}`)
            res.status(400).json({error: err.message}); 
        } else{
            res.status(201).send(resp.rows[0]); 
        }
    }); 
}); 

router.get("/", (req, res) => {
    const getAllGroupsQuery = `SELECT * FROM Groups`;
    pool.query(getAllGroupsQuery).then(result => {
        res.status(200).json({message: "Got all Groups!", groups: result.rows}); 
    }).catch(err => res.status(400).json({error: err.message}));
}); 

router.get('/:id', (req, res) => {
    const groupID = req.params.id; 
    const getGroupMembersQuery = `SELECT * FROM GroupMembers WHERE memberid = $1`
    pool.query(getGroupMembersQuery, [groupID], (err, result) => {
        if (err) {
            console.log(err.message); 
            res.status(400).send('Error getting group members');
        } else {
            res.status(200).json({message: "Got all Groups!", groups: result.rows}); 
        }
    }); 
}); 

router.put('/:id', (req, res) => {
    const memberID = req.params.id; 
    const body = req.body; 
    const {groupID, isLeader, amountOwed, hasAcceptedTerms} = body; 
    const putQuery = `UPDATE GroupMembers
                     SET isLeader=$2, amountOwed=$3, hasAcceptedTerms=$4
                     WHERE groupID = $1 AND memberID = $5`;
    const values = [groupID, isLeader, amountOwed, hasAcceptedTerms, memberID];
    pool.query(putQuery, values, (err, result) => {
        if(err){
            res.status(400).json({error: err.message}); 
        } else{
            const getUpdatedGroupMemberQuery = `SELECT * FROM GroupMembers WHERE groupID = $1 AND memberID = $2`;
            pool.query(getUpdatedGroupMemberQuery, [groupID, memberID]).then(result => {
                if(!result.rows.length){
                    res.status(404).json({message: "Can't find the newly updated group member!"}); 
                }
                res.status(200).json({message: "Succesfully updated group member!", groupMember: result.rows[0]})
            }).catch(err => res.status(400).json({error: err.message})); 
        }
    }); 
});

// router.delete('/:id', (req, res) => {
//   const groupID = req.params.id;
//   const deleteQuery = `DELETE FROM GroupMembers WHERE groupid = $1`;
//   pool.query(deleteQuery, [groupID], (err, result) => {
//       if (err) {
//           console.log(err.message);
//           res.status(400).send('Error deleting group members');
//       } else {
//           res.status(200).json({ message: 'Group members deleted successfully' });
//       }
//   });
// });

router.delete('/:id', (req, res) => {
    const groupID = req.params.id;
  
    pool.query('BEGIN', async (err) => {
      if (err) {
        console.log(err.message);
        return res.status(500).send('Error starting transaction');
      }

      const deleteMembersQuery = 'DELETE FROM GroupMembers WHERE groupid = $1';
      try {
        await pool.query(deleteMembersQuery, [groupID]);
      } catch (err) {
        console.log(err.message);
        await pool.query('ROLLBACK');
        return res.status(400).send('Error deleting group members');
      }
      const deleteGroupQuery = 'DELETE FROM Groups WHERE groupID = $1';
      try {
        await pool.query(deleteGroupQuery, [groupID]);
        await pool.query('COMMIT');
        res.status(200).json({ message: 'Group and group members deleted successfully' });
      } catch (err) {
        console.log(err.message);
        await pool.query('ROLLBACK');
        return res.status(400).send('Error deleting the group');
      }
    });
  });
  

module.exports = router; 