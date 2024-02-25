import ProfileIcon from "../components/ProfileIcon"; 
import styles from "../module-styles/ProfilePage.module.css"; 
import { useState } from "react";

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const logOutHandler = () => {
        console.log(`logoutHandler called!`); 
    }

    const toggleEditSaveHandler = () => {
        if (isEditing) {
            console.log(`save profile called`);
        } else {
            console.log(`edit profile called`);
        }
        setIsEditing(!isEditing); 
    };
    return (
        <div className={styles["profile-wrapper"]}>
            <ProfileIcon imgUrl="images/logo192.png"></ProfileIcon>
            <button
                type="button"
                className={styles["edit"]}
                onClick={toggleEditSaveHandler}
            >
                {isEditing ? 'Save' : 'Edit Profile'}
            </button>
            <div className={styles["column"]}>
                <span>Name: John Doe</span>
                <span>Email: johndoe@gmail.com</span>
                <span>Phone Number: 1-624-212-1111</span>
            </div>
            <button onClick = {logOutHandler} className={styles["log-out"]}type="button">Log-Out</button>
        </div>
    ); 
}

export default ProfilePage; 