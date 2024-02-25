import styles from "../module-styles/HomePage.module.css"
import {useState} from "react"; 
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
    const handleCreateGroup = () => {
        const newGroup = {groupName, groupID: uuidv4(), leaderID: "", hasEveryoneAcceptedTerms: false, totalOwed: 0.0, isCurrent: true}
        Axios.post("http://localhost:8000/groups", newGroup).then(response => {
            console.log(response); 
        }).catch(err => console.log(err.message)); 
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