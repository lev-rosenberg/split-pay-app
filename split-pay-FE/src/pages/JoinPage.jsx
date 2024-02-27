import React, { useEffect, useState, useContext } from "react";
import { Context } from "../contexts/userContext";
import { useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";

export default function JoinPage() {
    const { state } = useContext(Context);
    const { userId } = state;
    const loc = useLocation();
    const groupId = loc.key;
    const [groupData, setGroupData] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        Axios.get(`http://localhost:8000/groups/${groupId}`).then(response => {
            const groupData = response.data.group;
            setGroupData(groupData);
        }).catch(err => console.log(err.message));
    }, [groupId]);
    
    function handleJoinGroup() {
        // add user to group
        const newGroupMember = {groupID: groupId, memberID: userId, isLeader: false}
        Axios.post(`http://localhost:8000/groupmembers/`, newGroupMember).then(response => {
            console.log(`User added to group!`);
        }).catch(err => console.log(err.message));
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