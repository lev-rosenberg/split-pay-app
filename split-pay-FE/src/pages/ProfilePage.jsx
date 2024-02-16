import ProfileIcon from "../components/ProfileIcon"; 
import styles from "../module-styles/ProfilePage.module.css"; 
const ProfilePage = () => {
    const logOutHandler = () => {
        console.log(`logoutHandler called!`); 
    }
    const editProfileHandler = () => {
        console.log(`edit profile called`); 
    }
    return (
        <div className={styles["profile-wrapper"]}>
            <button type="button" className={styles["edit"]} onClick={editProfileHandler}>Edit Profile</button>
            <ProfileIcon imgUrl="images/logo192.png"></ProfileIcon>
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