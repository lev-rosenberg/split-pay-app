import React, { useEffect, useState, useContext } from "react";
import { Context } from "../contexts/userContext";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";

export default function JoinPage() {
    const { state } = useContext(Context);
    const { userId } = state;
    const { groupID } = useParams();
    const [groupData, setGroupData] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_API_URL}/groups/${groupID}`).then(response => {
            const groupData = response.data.group;
            setGroupData(groupData);
        }).catch(err => console.log(err.message));
    }, [groupID]);
    
    function handleJoinGroup() {
        // add user to group
        const newGroupMember = {groupID: groupID, memberID: userId, isLeader: false, amountOwed: 0.0, hasAcceptedTerms: false}
        //only add new member to group if it's not a leader for the given group! The leader should already be in the GroupMembers table 
        //by the time group join link got created!
        if(groupData.leaderid !== userId){
            Axios.post(`${process.env.REACT_APP_API_URL}/groupmembers/`, newGroupMember).then(response => {}).catch(err => console.log(err.message));
            navigate("/status", {state: {groupData: groupData}})
        }
    }

    return (
        <div>
            <h1>Join Page</h1>
            <p>Group Name: {groupData.groupname}</p>
            <button onClick={handleJoinGroup}>Join</button>
        </div>
    );
}