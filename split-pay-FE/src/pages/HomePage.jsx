import styles from "../module-styles/HomePage.module.css"
import React, { useState, useContext } from "react";
import { Context } from "../contexts/userContext"; 
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { v4 as uuidv4 } from 'uuid';
import Axios from "axios";
const HomePage = () => {
    const [groupName, setGroupName] = useState(""); 
    const [isCreated, setIsCreated] = useState(false); 
    const [groupLink, setGroupLink] = useState('')
    const { state } = useContext(Context);
    const handleCreateGroup = () => {
        const groupID = uuidv4();
        // add group to groups table!
        const newGroup = {groupName: groupName, groupID: groupID, leaderID: state.userId, hasEveryoneAcceptedTerms: false, totalOwed: 0.0, isCurrent: true}
        Axios.post("http://localhost:8000/groups", newGroup).then(response => {
          Axios.post("http://localhost:8000/groupMembers", newGroupMember).then(response => {
            console.log(response); 
          }).catch(err => console.log(err.message));
        }).catch(err => console.log(err.message)); 
        // add group-member association to groupMembers table!
        const newGroupMember = {groupID: groupID, memberID: state.userId, isLeader: true}
        
        setIsCreated(true); 
        setGroupLink('https://unique-link-to-group-page'); 
    }
    const handleCopyLink = (linkURL) => {
        navigator.clipboard.writeText(linkURL).then(()=> {
            console.log('success'); 
        }).catch(err => console.log(err.message)); 
        window.alert("successfully copied to your clipboard"); 
    }
    return (
        <div className={styles["home-container"]}>
            <h1>Create a Group</h1>
            <div className={styles["input-container"]}>
                <label htmlFor="group-name">New Group Name:</label>
                <input name="group-name" placeholder="Enter your group here!" type="text" onChange={(e) => setGroupName(e.target.value)}></input>
            </div>
            {groupName.length > 0 && <button type="button" onClick={handleCreateGroup}>Create Group</button>}
            {isCreated && (
                <Dialog className={styles["dialog"]} open={isCreated} onClose={() => setIsCreated(false)}>
                    <DialogContent>Share Group Join Link: <br></br><span>{groupLink}</span></DialogContent>
                    <DialogActions>
                        <IconButton aria-label="copy link" onClick={() => handleCopyLink(groupLink)}>
                            <ContentCopyIcon /> 
                        </IconButton>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    ); 
}
export default HomePage; 