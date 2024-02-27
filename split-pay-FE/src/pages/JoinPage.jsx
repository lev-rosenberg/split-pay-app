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
        Axios.get(`http://localhost:8000/groups/${groupID}`).then(response => {
            const groupData = response.data.group;
            console.log("response", response.data);
            setGroupData(groupData);
        }).catch(err => console.log(err.message));
    }, [groupID]);
    
    function handleJoinGroup() {
        // add user to group
        const newGroupMember = {groupID: groupID, memberID: userId, isLeader: false, amountOwed: 0.0, hasAcceptedTerms: false}
        Axios.post(`http://localhost:8000/groupmembers/`, newGroupMember).then(response => {}).catch(err => console.log(err.message));
        navigate("/status", {state: {groupData: groupData}})
    }

    return (
        <div>
            <h1>Join Page</h1>
            <p>Group Name: {groupData.groupname}</p>
            <button onClick={handleJoinGroup}>Join</button>
        </div>
    );
}