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
    console.log(`groupMembers state: \n`)
    console.log(groupMembers)
    //const [hasEveryoneAcceptedTerms, setHasEveryoneAcceptedTerms] = useState(false);
    const loc = useLocation();
    const { groupid, groupname, iscurrent, leaderid} = loc.state && loc.state.groupData;
    const { state } = useContext(Context);
    const { userId }  = state ;
    console.log(`leaderId of group: ${leaderid}`); 
    console.log(`cur user id: ${userId}`); 
    const isLeader = leaderid === userId; 
    const totalowed = groupMembers.reduce((prev, cur) => prev + cur.amountowed, 0);
    const hasEveryoneAcceptedTerms = groupMembers.reduce((prev, cur) => prev & cur.hasacceptedterms, true); 
    console.log(`hasEveryoneAcceptedTerms: ${hasEveryoneAcceptedTerms}`)
    const fetchGroupInfo = () => {
        console.log("fetching latest group info...");
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
            //setHasEveryoneAcceptedTerms(groupData.haseveryoneacceptedterms);
        }).catch(err => console.log(err.message));
    };
    const handleWebSocketMessage = (event) => {
        console.log(`handleWebSocketMessage fired!`); 
        console.log('event: '); 
        console.log(event)
        const data = JSON.parse(event.data);
        if(data.event === 'update'){
            //refetch group info upon receiving update event, which is only sent by ws server upon receiving "initiate-payment"
            //event from leader! 
            console.log('received update event...'); 
            fetchGroupInfo(); 
        }
    }
    useEffect(() => {
        //set up ws connection to back-end server! 
        const ws = new WebSocket('ws://localhost:8000'); 
        ws.onopen = () => {
            ws.send(JSON.stringify({event: 'subscribe', groupid: groupid, userid: userId}))
        }
        ws.onmessage = handleWebSocketMessage; 
        //for initial mount, we need to fetch data first! 
        fetchGroupInfo(); 
        //return cleanup function that will close down web-socket connection to prevent memory leak! 
        return () => {
            ws.close(); 
        }
    }, [groupid, hasEveryoneAcceptedTerms]);
    return (
        <div className={styles["status-wrapper"]}>
            <h3>Status of {groupname}</h3>
            <span>Amount Owed</span>
            <div className={styles["members-status"]}>
                {groupMembers.map((gm, idx) => <MemberStatus key={idx} member={gm} groupid = {groupid}/> )}
            </div>
            <div className={styles["total-owed"]}>
                <p>Total Owed: ${totalowed} </p>
            </div>
            {console.log(`iscurrent: ${iscurrent}, isLeader: ${isLeader}, hasEveryoneAcceptedTerms: ${hasEveryoneAcceptedTerms}`)}
            {(iscurrent && isLeader && hasEveryoneAcceptedTerms) ? <button type="button">Finish Pay</button> : null} 
        </div>  
    ); 
};

export default StatusPage; 