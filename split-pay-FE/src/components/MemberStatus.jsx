import React, { useState, useContext } from "react"; 
import { Context } from "../contexts/userContext";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import styles from "../module-styles/MemberStatus.module.css"; 
import Axios from "axios";
const MemberStatus = ({member, groupid}) => {
    const {userid, isleader, amountowed, username, hasacceptedterms } = member;
    const [isAgreed, setIsAgreed] = useState(hasacceptedterms); 
    const { state } = useContext(Context);
    function handleChangeAgreed() {
      const user = {groupID: groupid, isLeader: isleader, hasAcceptedTerms: !isAgreed, amountOwed: amountowed};
      Axios.put(`http://localhost:8000/groupMembers/${userid}`, user).then(response => {}).catch(err => console.log(err.message));
      setIsAgreed(!isAgreed);
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