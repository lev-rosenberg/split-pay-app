import {useState, useEffect, useContext} from "react"; 
import { Context } from "../contexts/userContext";
import Axios from "axios";
import GroupCard from "../components/GroupCard";
import styles from "../module-styles/GroupsPage.module.css"; 

const GroupsPage = () => {
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
    
    return (
        <div className={styles["groups-container"]}>
            <h1>Your Groups</h1>
            <h3>Current Groups:</h3>
            <div className={styles["groups-list"]}>
                {curGroups.map((cg, idx) => (
                  <GroupCard key = {'c' + idx} group={cg} idx={idx} />
                ))}
            </div>
            <h3>Past Groups:</h3>
            <div className={styles["groups-list"]}>
                {prevGroups.map((ag, idx) => (
                  <GroupCard key = {'p' + idx} group={ag} idx={idx} />
                ))}
            </div>
        </div>
    ); 
}

export default GroupsPage; 