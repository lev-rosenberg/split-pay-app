import styles from "../module-styles/GroupsPage.module.css"; 
import {useState} from "react"; 
import { useNavigate } from "react-router-dom";
const GroupsPage = () => {
    const navigate = useNavigate(); 
    const [curGroups, setCurGroups] = useState(["Group1"]); 
    const [allGroups, setAllGroups] = useState(["Group1", "Group2", "Awesome Group Name", "Another Group", "Group 4","Group 5"]); 
    //function that is called when button  click happens => initiates payment split for the pertained group! 
    const handleInitiatePaymentSplit = (cg) => {
        //switch route to status to show in real-time status page for this specific group! 
        navigate("/payment", {state: {groupName: cg}}); 
    }
    return (
        <div className={styles["groups-container"]}>
            <h1>Your Groups</h1>
            <div className={styles["current-group"]}>
                <h5>Current Group:</h5>
                {curGroups.map(cg => <button type="button" onClick={() => handleInitiatePaymentSplit(cg)}>{cg}</button>)}
            </div>
            <div className={styles["all-groups"]}>
                <h5>All Groups:</h5>
                {allGroups.map((ag, idx) => <button key = {idx} type="button" onClick={() => handleInitiatePaymentSplit(ag)}>{ag}</button>)}
            </div>
        </div>
    ); 
}

export default GroupsPage; 