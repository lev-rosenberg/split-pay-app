import styles from "../module-styles/GroupsPage.module.css"; 
const GroupsPage = () => {
    return (
        <div className={styles["groups-container"]}>
            <h1>Your Groups</h1>
            <div className={styles["current-group"]}>
                <h5>Current Group:</h5>
                <button type="button">Group 1</button>
                <button type="button">Group 2</button>
            </div>
            <div className={styles["all-groups"]}>
                <h5>All Groups:</h5>
                <button type="button">Group 1</button>
                <button type="button">Awesome Group Name</button>
                <button type="button">Another Group</button>
                <button type="button">Group 4</button>
            </div>
        </div>
    ); 
}

export default GroupsPage; 