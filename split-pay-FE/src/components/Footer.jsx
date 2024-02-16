import { CgProfile } from "react-icons/cg";
import { HiUserGroup } from "react-icons/hi2";
import { FaRegPlusSquare } from "react-icons/fa";
import styles from "../module-styles/Footer.module.css"; 
const Footer = () => {
    return (
        <div className={styles["footer-container"]}>
            <HiUserGroup className={styles["icon-button"]}/> 
            <FaRegPlusSquare className={styles["icon-button"]}/> 
            <CgProfile className={styles["icon-button"]}/> 
        </div>
    ); 
}

export default Footer; 