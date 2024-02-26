const express = require('express')
const router = express.Router(); 
const pool = require('../pool.js') 

router.post('/', (req, res) => {
    console.log("handler for posting user triggered!"); 
  //parse request body! 
  const body = req.body; 
  const {userID, isLeader, hasAcceptedTerms, amountOwed, userName, email} = body; 
  const query = 
    `INSERT INTO Users(userID, isLeader, hasAcceptedTerms, amountOwed, userName, email) 
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (userID) DO NOTHING` // if user already exists, don't add them again!
  const values = [userID, isLeader, hasAcceptedTerms, amountOwed, userName, email]
  pool.query(query,
              values, 
              (err, result) => {
      if(err){
          console.log(`error message users: ${err.message}`); 
          res.status(400).json({error: err.message}); 
      }
      else{
          const getNewInsertedQuery = `SELECT * FROM Users WHERE userID = $1`
          pool.query(getNewInsertedQuery, [userID]).then(result => {
            console.log(result);
            res.status(201).json({message: "Successfully added new user!", newUser: result.rows[0]});
          }).catch(err => {
            res.status(400).json({error: "Can't add a new user!"}); 
          });
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
            res.status(400).json({error: err.message}); 
        } else{
            console.log(`res: \n`); 
            console.log(response.rows[0]); 
            if(!response.rows.length){
                res.status(404).json({error: `User with id: ${userID} not found!`}); 
                return; 
            } 
            res.status(200).json({message: "Succesfully got user!", user: response.rows[0]})
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
            res.status(400).json({error: err.message}); 
        } else{
            const getUpdatedUserQuery = `SELECT * FROM Users WHERE userID = $1`;
            pool.query(getUpdatedUserQuery, [userID]).then(result => {
                if(!result.rows.length){
                    res.status(404).json({error: `User with id ${userID} can't be found to update!`}); 
                }else{
                    const newUpdatedUser = result.rows[0]; 
                    res.status(200).json({message: `successfully updated user with id ${userID}`, updatedUser: newUpdatedUser});
                }
            }).catch(err => res.status(400).json({error: err.message})); 
        }
    }); 
});

router.delete('/:id', (req, res) => {
    const userID = req.params.id; 
    const deleteQuery = `DELETE FROM Users WHERE userID = $1`;
    const checkUserQuery = `SELECT * FROM Users WHERE userID = $1`;
    pool.query(checkUserQuery, [userID]).then((result) => {
        if(!result.rows.length){
            res.status(404).json({error: `Can't find user with id: ${userID} to delete!`});
        } else{
            const deletedUser = result.rows[0]; 
            pool.query(deleteQuery, [userID]).then(_ => {
                res.status(200).json({message: `Successfully deleted user with id: ${userID}`, deletedUser});
            }).catch(err => res.status(400).json({error: err.message})); 
        }
    }).catch(err => res.status(400).json({error: err.mesage})); 
});
module.exports = router; 