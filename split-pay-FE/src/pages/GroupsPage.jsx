import {useState, useEffect, useContext} from "react"; 
import { Context } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import styles from "../module-styles/GroupsPage.module.css"; 

const GroupsPage = () => {
    const navigate = useNavigate(); 
    const [curGroups, setCurGroups] = useState([]); 
    const [prevGroups, setPreviousGroups] = useState([]); 

    const { state } = useContext(Context);
    const { userId }  = state ;

    //get all groups from server!
    useEffect(() => {
      Axios.get(`http://localhost:8000/groupMembers/${userId}`).then(response => {
        const groupsData = response.data.groups;
        const curGroups = [];
        const allGroups = [];
        for (let i = 0; i < groupsData.length; i++) {
          const groupName = groupsData[i].groupname;
          if (groupsData[i].iscurrent) {
            curGroups.push(groupName);
          }
          else {
            allGroups.push(groupName);
          }
        }
        setCurGroups(curGroups);
        setPreviousGroups(allGroups);
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
                {curGroups.map((cg, idx) => (
                  <button key = {'c' + idx} type="button" onClick={() => handleInitiatePaymentSplit(cg)}>{cg}</button>
                ))}
            </div>
            <h5>All Groups:</h5>
            <div className={styles["all-groups"]}>
                {prevGroups.map((ag, idx) => (
                  <button key = {'a' + idx} type="button" onClick={() => handleInitiatePaymentSplit(ag)}>{ag}</button>
                ))}
            </div>
        </div>
    ); 
}

export default GroupsPage; 