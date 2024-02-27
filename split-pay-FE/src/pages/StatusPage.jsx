import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "../module-styles/StatusPage.module.css"; 
import MemberStatus from "../components/MemberStatus"; 
import Axios from "axios";
const StatusPage = () => {
    const [groupMembers, setGroupMembers] = useState([]);
    const [hasEveryoneAcceptedTerms, setHasEveryoneAcceptedTerms] = useState({});
    const loc = useLocation();
    const { groupid, groupname, totalowed} = loc.state && loc.state.groupData;
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
    }, []);
    return (
        <div className={styles["status-wrapper"]}>
            <h3>Status of {groupname}</h3>
            <span>Amount Owed</span>
            <div className={styles["members-status"]}>
                {groupMembers.map((gm, idx) => <MemberStatus key={idx} memberName={gm.username} amountOwed={gm.amountowed}/> )}
            </div>
            <div className={styles["total-owed"]}>
                <p>Total Owed: ${totalowed} </p>
            </div>
            <button type="button">Finish Pay</button>
        </div>  
    ); 
};

export default StatusPage; 