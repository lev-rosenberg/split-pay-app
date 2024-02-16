import styles from "../module-styles/ProfileIcon.module.css"; 
import { IoPersonCircle } from "react-icons/io5";
const ProfileIcon = ({imgUrl}) => {
    return (
        <div className={styles["profile-icon-container"]}>
            {imgUrl ? <img src={imgUrl} alt="profile" className={styles["actual-image"]}></img>: <IoPersonCircle className={styles["react-icon"]}/>}
        </div>
    )
}

export default ProfileIcon; 