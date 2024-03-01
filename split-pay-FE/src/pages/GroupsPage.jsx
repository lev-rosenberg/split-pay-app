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
      Axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}/groups`).then(response => {
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
    }, [userId]); 

    //function that is called when button  click happens => initiates payment split for the pertained group! 
    const handleInitiatePaymentSplit = (group) => {
        const {leaderid}=group; 
        //if user clicked on group for which they are leader, transition to 
        if(leaderid === userId && group.iscurrent){
           //switch route to status to show in real-time status page for this specific group! 
           navigate("/payment", {state: {groupData: group}}); 
        } 
        //otherwise, it's a member clicking group! 
        else {
          navigate("/status", {state: {groupData: group}}); 
        }
    }
    return (
        <div className={styles["groups-container"]}>
            <h1>Your Groups</h1>
            <h5>Current Groups:</h5>
            <div className={styles["groups-list"]}>
                {curGroups.map((cg, idx) => (
                    <div 
                      key = {'c' + idx} 
                      className={styles["group-card"]}
                      onClick={() => handleInitiatePaymentSplit(cg)}>
                        <h4>{cg.groupname}</h4>
                        <p>Role: {(cg.leaderid === userId) ? "leader" : "member"}</p>
                    </div>
                ))}
            </div>
            <h5>Previous Groups:</h5>
            <div className={styles["groups-list"]}>
                {prevGroups.map((ag, idx) => (
                  <div 
                    key = {'a' + idx} 
                    className={styles["group-card"]}
                    onClick={() => handleInitiatePaymentSplit(ag)}>
                      <h4>{ag.groupname}</h4>
                      <p>Role: {(ag.leaderid === userId) ? "leader" : "member"}</p>
                  </div>
                ))}
            </div>
        </div>
    ); 
}

export default GroupsPage; 