const express = require('express')
const router = express.Router(); 
const pool = require('../pool.js') 

// groupId: "testId" memberId: "lev"
router.post('/', (req,res) => {
    const body = req.body; 
    const {groupID, memberID} = body
    const insertGroupMemberQuery = `INSERT INTO GroupMembers(groupid, memberid) VALUES($1, $2)`
    pool.query(insertGroupMemberQuery, [groupID, memberID], (err, resp) => {
        if(err){
            console.log(`error for inserting a new groupMember: ${err.message}`)
            res.status(400).json({error: err.message}); 
        } else{
            console.log("inserted new group member success!")
            res.status(201).send(resp.rows[0]); 
        }
    }); 
}); 


router.get('/:id', (req, res) => {
    const groupID = req.params.id; 
    const getGroupMembersQuery = `SELECT * FROM GroupMembers WHERE groupid = $1`
    pool.query(getGroupMembersQuery, [groupID], (err, result) => {
        if (err) {
            console.log(err.message); 
            res.status(400).send('Error getting group members');
        } else {
            console.log(`get res: ${result}`); 
            res.status(200).send(result.rows)
        }
    }); 
});

router.delete('/:id', (req, res) => {
  const groupID = req.params.id;
  const deleteQuery = `DELETE FROM GroupMembers WHERE groupid = $1`;
  pool.query(deleteQuery, [groupID], (err, result) => {
      if (err) {
          console.log(err.message);
          res.status(400).send('Error deleting group members');
      } else {
          console.log(`delete res: ${result}`);
          res.status(200).json({ message: 'Group members deleted successfully' });
      }
  });
});

module.exports = router; 