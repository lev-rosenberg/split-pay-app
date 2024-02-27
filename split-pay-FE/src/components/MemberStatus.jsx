import React, { useState } from "react"; 
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import styles from "../module-styles/MemberStatus.module.css"; 
import Axios from "axios";
const MemberStatus = ({member, groupid}) => {
    const {userid, isleader, amountowed, username, hasacceptedterms } = member;
    const [isAgreed, setIsAgreed] = useState(hasacceptedterms); 

    function handleChangeAgreed() {
      const user = {groupID: groupid, isLeader: isleader, hasAcceptedTerms: !isAgreed, amountOwed: amountowed};
      Axios.put(`http://localhost:8000/groupMembers/${userid}`, user).then(response => {}).catch(err => console.log(err.message));
      setIsAgreed(!isAgreed);
    }
    
    return (<div className={styles["member-status-wrapper"]}>
        <div className={styles["left"]}>
          <button onClick={handleChangeAgreed}>
            {isAgreed ? <CheckIcon /> : <CloseIcon />} 
          </button>
          <p>{username}</p>
        </div>
        <p>${amountowed}</p>
    </div>);
}

export default MemberStatus; 