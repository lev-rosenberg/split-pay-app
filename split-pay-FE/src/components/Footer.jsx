import { CgProfile } from "react-icons/cg";
import { HiUserGroup } from "react-icons/hi2";
import { FaRegPlusSquare } from "react-icons/fa";
import styles from "../module-styles/Footer.module.css"; 
import {useNavigate} from "react-router-dom"; 

const Footer = () => {
    const navigate = useNavigate(); 
    return (
        <footer>
            <HiUserGroup className={styles["icon-button"]} onClick={() => navigate("/groups-page")}/> 
            <FaRegPlusSquare className={styles["icon-button"]} onClick={() => navigate("/")}/> 
            <CgProfile className={styles["icon-button"]} onClick={() => navigate("/profile")}/> 
        </footer>
    ); 
}

export default Footer; 