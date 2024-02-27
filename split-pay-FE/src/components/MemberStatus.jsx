import React, {useState} from "react"; 
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import styles from "../module-styles/MemberStatus.module.css"; 
import Axios from "axios";
const MemberStatus = ({member}) => {
    const [isAgreed, setIsAgreed] = useState(false); 
    const {userid, username, email, amountowed} = member;
    
    function handleChangeAgreed() {
      const user = {hasAcceptedTerms: !isAgreed, amountOwed: amountowed, userName: username, email: email};
      Axios.put(`http://localhost:8000/users/${userid}`, user).then(response => {
        console.log("response from user put request: ", response.data);
      }).catch(err => console.log(err.message));
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