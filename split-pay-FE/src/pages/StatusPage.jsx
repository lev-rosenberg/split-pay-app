import { useLocation } from "react-router-dom";
import styles from "../module-styles/StatusPage.module.css"; 
import MemberStatus from "../components/MemberStatus"; 
const StatusPage = () => {
    const loc = useLocation();
    const groupMembers = loc.state && loc.state.groupMembers; 
    return (
        <div className={styles["status-wrapper"]}>
            <h3>Status of Group</h3>
            <span>Amount Owed</span>
            <div className={styles["members-status"]}>
                {groupMembers.map((gm, idx) => <MemberStatus key={idx} memberName={gm}/> )}
            </div>
            <div className={styles["total-owed"]}>
                <p>Total Owed: ${45.57} </p>
            </div>
            <button type="button">Finish Pay</button>
        </div>  
    ); 
};

export default StatusPage; 