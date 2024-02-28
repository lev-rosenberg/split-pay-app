import React, { useState, useContext } from "react"; 
import { Context } from "../contexts/userContext";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import styles from "../module-styles/MemberStatus.module.css"; 
import Axios from "axios";
const MemberStatus = ({member, groupid}) => {
    console.log(`memberstaus comp...`)
    console.log(member); 
    const {userid, isleader, amountowed, username, hasacceptedterms } = member;
    const [isAgreed, setIsAgreed] = useState(hasacceptedterms); 
    const { state } = useContext(Context);

    async function handleChangeAgreed() {
      try{
        const user = {groupID: groupid, isLeader: isleader, hasAcceptedTerms: !isAgreed, amountOwed: amountowed};
        await Axios.put(`http://localhost:8000/groupMembers/${userid}`, user).then(response => {}).catch(err => console.log(err.message));
        setIsAgreed(!isAgreed);
        //open up web-socket connection! 
        const ws = new WebSocket("ws://localhost:8000"); 
        ws.onopen = () => {
          ws.send(JSON.stringify({event: "status-changed", userid: userid})); 
          //close connection to prevent memory leak after alerting server of status-change event! 
          ws.close(); 
        }; 
      }
      catch(err){
        console.log(`Error in handling status change for a group member! Here is error message: ${err.message}`); 
      }
    }
    
    return (<div className={styles["member-status-wrapper"]}>
        <div className={styles["left"]}>
          {userid === state.userId ? 
              <button onClick={handleChangeAgreed}>
                {isAgreed ? <CheckIcon /> : <CloseIcon />} 
              </button>
              : 
              hasacceptedterms ? <CheckIcon /> : <CloseIcon />
          }
          <p>{username}</p>
        </div>
        <p>${amountowed}</p>
    </div>);
}

export default MemberStatus; 