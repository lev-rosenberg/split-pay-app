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
        } else{
            console.log("inserted new group member success!")
            res.status(201).send(resp.rows[0]); 
        }
    }); 
}); 

module.exports = router; 