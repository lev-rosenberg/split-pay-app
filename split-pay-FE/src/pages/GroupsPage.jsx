import {useState, useEffect, useContext} from "react"; 
import { Context } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import styles from "../module-styles/GroupsPage.module.css"; 

/* 
------- TO DO ------- 
1. frontend: differentiate between groups you are leader of and groups you are not leader of                                                                    
2. frontend: only navigate to payment page if you are leader of group, otherwise go to status page?
*/

const GroupsPage = () => {
    const navigate = useNavigate(); 
    const [curGroups, setCurGroups] = useState([]); 
    const [prevGroups, setPreviousGroups] = useState([]); 

    const { state } = useContext(Context);
    const { userId }  = state ;

    //get all groups from server!
    useEffect(() => {
      Axios.get(`http://localhost:8000/users/${userId}/groups`).then(response => {
        const groupsData = response.data.groups;
        const curGroups = [];
        const allGroups = [];
        for (let i = 0; i < groupsData.length; i++) {
          if (groupsData[i].iscurrent) {
            curGroups.push(groupsData[i]);
          }
          else {
            allGroups.push(groupsData[i]);
          }
        }
        setCurGroups(curGroups);
        setPreviousGroups(allGroups);
      }).catch(err => console.log(err.message));
    }, []); 

    //function that is called when button  click happens => initiates payment split for the pertained group! 
    const handleInitiatePaymentSplit = (group) => {
        //switch route to status to show in real-time status page for this specific group! 
        navigate("/payment", {state: {groupData: group}}); 
    }
    return (
        <div className={styles["groups-container"]}>
            <h1>Your Groups</h1>
            <h5>Current Group:</h5>
            <div className={styles["current-group"]}>
                {curGroups.map((cg, idx) => (
                  <button key = {'c' + idx} type="button" onClick={() => handleInitiatePaymentSplit(cg)}>{cg.groupname}</button>
                ))}
            </div>
            <h5>All Groups:</h5>
            <div className={styles["all-groups"]}>
                {prevGroups.map((ag, idx) => (
                  <button key = {'a' + idx} type="button" onClick={() => handleInitiatePaymentSplit(ag)}>{ag.groupname}</button>
                ))}
            </div>
        </div>
    ); 
}

export default GroupsPage; 