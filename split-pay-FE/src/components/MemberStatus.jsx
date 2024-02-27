import {useState} from "react"; 
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import styles from "../module-styles/MemberStatus.module.css"; 
const MemberStatus = ({memberName, amountOwed}) => {
    const [isAgreed, setIsAgreed] = useState(false); 
    return (<div className={styles["member-status-wrapper"]}>
        <div className={styles["left"]}>
          {isAgreed ? <CheckIcon /> : <CloseIcon />} 
          <p>{memberName}</p>
        </div>
        <p>${amountOwed}</p>
    </div>);
}

export default MemberStatus; 