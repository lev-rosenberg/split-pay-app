import styles from "../module-styles/HomePage.module.css"
import {useState} from "react"; 
const HomePage = () => {
    const [groupName, setGroupName] = useState(""); 
    const handleCreateGroup = () => {
        console.log("handleCreateGroup called"); 
    }
    return (
        <div className={styles["home-container"]}>
            <h1>Create a Group</h1>
            <div className={styles["input-container"]}>
                <label htmlFor="group-name">New Group Name:</label>
                <input name="group-name" placeholder="Enter your group here!" type="text" onChange={(e) => setGroupName(e.target.value)}></input>
            </div>
            {groupName.length > 0 && <button type="button" onClick={handleCreateGroup}>Create Group</button>}
        </div>
    ); 
}

export default HomePage; 