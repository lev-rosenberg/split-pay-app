import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../module-styles/StatusPage.module.css"; 
import MemberStatus from "../components/MemberStatus"; 
import Axios from "axios";
import { Context } from "../contexts/userContext";
import Modal from "../components/Modal";
import CreditCardImage from "../CreditCardCropped.png"
import CreditCard from "../components/CreditCard";
/* 
------- TO DO ------- 
1. backend: incorporate websocket to update status page in real-time
2. backend: add put request to group table to update haseveryoneacceptedterms once all members have accepted terms
3. frontend: disable finish payment button until all members have accepted terms
4. backend: once payment finished, update isCurrent to false in group table
*/

const StatusPage = () => {
    const navigate = useNavigate(); 
    const [groupMembers, setGroupMembers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [UserData, setUserData] = useState({username: "Loading..."});
    console.log(`groupMembers state: \n`)
    console.log(groupMembers)
    //const [hasEveryoneAcceptedTerms, setHasEveryoneAcceptedTerms] = useState(false);
    const loc = useLocation();
    const { groupid, groupname, iscurrent, leaderid} = loc.state && loc.state.groupData;
    const { state } = useContext(Context);
    const { userId }  = state ;
    const isLeader = leaderid === userId; 
    const totalowed = groupMembers.reduce((prev, cur) => prev + cur.amountowed, 0);
    const hasEveryoneAcceptedTerms = groupMembers.reduce((prev, cur) => prev & cur.hasacceptedterms, true); 
    const fetchGroupInfo = () => {
        Axios.get(`${process.env.REACT_APP_API_URL}/groups/${groupid}/users`).then(response => {
            const userData = response.data.users;
            const users = [];
            for (let i = 0; i < userData.length; i++) {
                users.push(userData[i]);
            }
            setGroupMembers(users);
        }).catch(err => console.log(err.message));
        Axios.get(`${process.env.REACT_APP_API_URL}/groups/${groupid}`).then(response => {
            const groupData = response.data.group;
            //setHasEveryoneAcceptedTerms(groupData.haseveryoneacceptedterms);
        }).catch(err => console.log(err.message));
        Axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`).then(response => {
            const userData = response.data.user;
            setUserData(userData);
        }).catch(err => console.log(err.message));
    };
    const handleWebSocketMessage = (event) => {
        console.log(`handleWebSocketMessage fired!`); 
        console.log('event: ', event); 
        const data = JSON.parse(event.data);
        if(data.event === 'update') {
            //refetch group info upon receiving update event, which is only sent by ws server upon receiving "initiate-payment"
            //event from leader! 
            console.log('received update event...'); 
            fetchGroupInfo(); 
        }
    }
    const handleActiveChange = async (event) => {
        try {
            const newGroup = {leaderID: leaderid, groupName: groupname, hasEveryoneAcceptedTerms: hasEveryoneAcceptedTerms, totalOwed: totalowed, isCurrent: true}; 
            //wait for DB update to update group's state to active group! 
            await Axios.put(`${process.env.REACT_APP_API_URL}/groups/${groupid}`, newGroup); 
            window.alert(`Group ${groupname} is now active!`);
            navigate("/groups-page"); 
        } catch(err){
            console.log(`Failed to update group to be active again!`); 
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
    }, [groupid, hasEveryoneAcceptedTerms, userId]);
    const handlePaymentSubmit = async () =>{
        setIsModalOpen(!isModalOpen);
        const updatedGroup = {leaderID: leaderid, groupName: groupname, hasEveryoneAcceptedTerms: hasEveryoneAcceptedTerms, totalOwed: totalowed, isCurrent: false}; 
        await Axios.put(`${process.env.REACT_APP_API_URL}/groups/${groupid}`,updatedGroup); 
        window.alert("Payment submitted!"); 
    } 
    const rotateStyle = {
        transform: 'rotate(90deg)',
        height: "300px"
      };
      const cardInfo = {
        name: UserData.username,
        number: '1234 5678 9012 3456',
        expiry: '12/25',
      };

    return (
        <div className={styles["status-wrapper"]}>
            <h1>Status of {groupname}</h1>
            <h3>Amount Owed</h3>
            <div className={styles["members-status"]}>
                {groupMembers.map((gm, idx) => <MemberStatus key={idx} member={gm} groupid = {groupid}/> )}
            </div>
            <div className={styles["total-owed"]}>
                <p>Total: ${totalowed} </p>
            </div>
            <div className={styles["leader-btns"]}>
              {(iscurrent && isLeader && hasEveryoneAcceptedTerms) ? <button type="button" onClick={handlePaymentSubmit}>Finish Pay</button> : null} 
              {!iscurrent && <button onClick={handleActiveChange}>Make Group Active!</button>}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(prev => !prev)}>
                {cardInfo && <CreditCard cardInfo={cardInfo} />}
                {/* <img style={rotateStyle}src={CreditCardImage} alt="Credit Card for NFC Payment" />      */}
            </Modal>
        </div>  
    ); 
};

export default StatusPage; 