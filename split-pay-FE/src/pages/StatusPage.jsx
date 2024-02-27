import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import styles from "../module-styles/StatusPage.module.css"; 
import MemberStatus from "../components/MemberStatus"; 
import Axios from "axios";
import { Context } from "../contexts/userContext";
/* 
------- TO DO ------- 
1. backend: incorporate websocket to update status page in real-time
2. backend: add put request to group table to update haseveryoneacceptedterms once all members have accepted terms
3. frontend: disable finish payment button until all members have accepted terms
4. backend: once payment finished, update isCurrent to false in group table
*/

const StatusPage = () => {
    const [groupMembers, setGroupMembers] = useState([]);
    const [hasEveryoneAcceptedTerms, setHasEveryoneAcceptedTerms] = useState(false);
    const loc = useLocation();
    const { groupid, groupname, totalOwed, iscurrent, leaderid} = loc.state && loc.state.groupData;
    const { state } = useContext(Context);
    const { userId }  = state ;
    const isLeader = leaderid === userId; 
    console.log("isCurrent", iscurrent);
    useEffect(() => {
        Axios.get(`http://localhost:8000/groups/${groupid}/users`).then(response => {
            const userData = response.data.users;
            const users = [];
            for (let i = 0; i < userData.length; i++) {
                users.push(userData[i]);
            }
            setGroupMembers(users);
        }).catch(err => console.log(err.message));
        Axios.get(`http://localhost:8000/groups/${groupid}`).then(response => {
            const groupData = response.data.group;
            setHasEveryoneAcceptedTerms(groupData.haseveryoneacceptedterms);
        }).catch(err => console.log(err.message));
    }, [groupid, hasEveryoneAcceptedTerms]);
    return (
        <div className={styles["status-wrapper"]}>
            <h3>Status of {groupname}</h3>
            <span>Amount Owed</span>
            <div className={styles["members-status"]}>
                {groupMembers.map((gm, idx) => <MemberStatus key={idx} member={gm} groupid = {groupid}/> )}
            </div>
            <div className={styles["total-owed"]}>
                <p>Total Owed: ${totalOwed} </p>
            </div>
            {iscurrent && (isLeader) && hasEveryoneAcceptedTerms && <button type="button">Finish Pay</button>} 
        </div>  
    ); 
};

export default StatusPage; 