import styles from "../module-styles/GroupsPage.module.css"; 
import {useState, useEffect} from "react"; 
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const GroupsPage = () => {
    const navigate = useNavigate(); 
    const [curGroups, setCurGroups] = useState([]); 
    const [allGroups, setAllGroups] = useState([]); 
    //get all groups from server!
    useEffect(() => {
        Axios.get("http://localhost:8000/groups/").then(response => {
            console.log(response.data.groups); 
            setAllGroups(response.data.groups.map(g => g.groupname));
            setCurGroups(response.data.groups.filter(group => group.isCurrent).map(group => group.groupname))
        }).catch(err => console.log(err.message)); 
    }, []); 
    //function that is called when button  click happens => initiates payment split for the pertained group! 
    const handleInitiatePaymentSplit = (cg) => {
        //switch route to status to show in real-time status page for this specific group! 
        navigate("/payment", {state: {groupName: cg}}); 
    }
    return (
        <div className={styles["groups-container"]}>
            <h1>Your Groups</h1>
            <h5>Current Group:</h5>
            <div className={styles["current-group"]}>
                {curGroups.map(cg => <button type="button" onClick={() => handleInitiatePaymentSplit(cg)}>{cg}</button>)}
            </div>
            <h5>All Groups:</h5>
            <div className={styles["all-groups"]}>
                {allGroups.map((ag, idx) => <button key = {idx} type="button" onClick={() => handleInitiatePaymentSplit(ag)}>{ag}</button>)}
            </div>
        </div>
    ); 
}

export default GroupsPage; 