import React, { useEffect, useState, useContext } from "react";
import { Context } from "../contexts/userContext";
import ProfileIcon from "../components/ProfileIcon"; 
import Axios from "axios";
import styles from "../module-styles/ProfilePage.module.css"; 

/* 
------- TO DO ------- 
1. frontend: add input functionality for when editing
2. backend: add put request to user table editing details
3. frontend: add logout functionality from the google oauth package 
*/

const ProfilePage = () => {
    const { state } = useContext(Context);
    const { userId } = state;
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({});
    const logOutHandler = () => {
        console.log(`logoutHandler called!`); 
    }
    useEffect(() => {
        Axios.get(`http://localhost:8000/users/${userId}`).then(response => {
            const userData = response.data.user;
            setUserData(userData);
        }).catch(err => console.log(err.message));
    }, [userId, isEditing]);
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
                <span>Name: {userData.username}</span>
                <span>Email: {userData.email}</span>
            </div>
            <button onClick = {logOutHandler} className={styles["log-out"]}type="button">Log-Out</button>
        </div>
    ); 
}

export default ProfilePage; 