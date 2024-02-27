import React, { useState, useEffect } from "react"; 
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../module-styles/PaymentPage.module.css"; 
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'; 
import FormLabel from '@mui/joy/FormLabel';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Axios from "axios";

function PaymentPage() {
    const navigate = useNavigate(); 
    const loc = useLocation();
    const [formFields, setFormFields] = useState({amount: 0, strategy: "equal", "alert": "Yes"}); 
    const [groupMembers, setGroupMembers] = useState([]);
    const [customAmounts, setCustomAmounts] = useState({});
    const groupData = loc.state && loc.state.groupData; 

    //also need way to get all members part of group with given "groupName"! 
    useEffect(() => {
      console.log(groupData);
      Axios.get(`http://localhost:8000/groups/${groupData.groupid}/users`).then(response => {
        const userData = response.data.users;
        console.log("user data", userData);
        const users = [];
        for (let i = 0; i < userData.length; i++) {
          users.push(userData[i]);
        }
        setGroupMembers(users);
      }).catch(err => console.log(err.message));
    }, []); 

    //need some way to get group size! 
    const groupSize = groupMembers.length;  
    const equalAmount = formFields["strategy"] === "equal" && (formFields["amount"] / groupSize).toFixed(2); 
    
    const updateFormFields = (field, e) => {
        const newState = {...formFields}; 
        let newVal = e.target.value
        if(field === "amount"){
            newVal = parseFloat(newVal.replace(/[^\d.]/g, ''));
        }
        newState[field] = newVal; 
        setFormFields(newState); 
    }

    const handlePaymentStart = () => {
        //transition over to see real-time status updates for each member of group! 
        for (let i = 0; i < groupMembers.length; i++) {
          const {userid, username, email, hasacceptedterms} = groupMembers[i];
          const amountOwed = formFields["equal"] === "custom" ? equalAmount : customAmounts[userid];
          console.log("amount owed: ", amountOwed);
          const user = {hasAcceptedTerms: hasacceptedterms, amountOwed: amountOwed, userName: username, email: email};
          Axios.put(`http://localhost:8000/users/${userid}`, user).then(response => {  
            console.log("response from user put request: ", response.data);
          }).catch(err => console.log(err.message));
        }
        const {groupid, leaderid, groupname, haseveryoneacceptedterms, iscurrent} = groupData;
        const group = {leaderID: leaderid, groupName: groupname, hasEveryoneAcceptedTerms: haseveryoneacceptedterms, totalOwed: formFields["amount"], iscurrent: iscurrent};
        Axios.put(`http://localhost:8000/groups/${groupid}`, group).then(response => {
          console.log("response from group put request: ", response.data);
        }).catch(err => console.log(err.message));
        navigate("/status", {state: {groupData: groupData}}); 
    }

    function handleCustomAmounts(groupname, e) {
        const newState = {...customAmounts}; 
        newState[groupname] = e.target.value; 
        setCustomAmounts(newState);
        console.log(customAmounts);
    }

    return (
        <div className={styles["payment-page-container"]}>
            <h3>Payment For {groupData.groupname}</h3>
            <div className={styles["single-input"]}>
                <FormControl className={styles["form-control"]}>
                    <InputLabel htmlFor="bill-amount">Amount</InputLabel>
                    <OutlinedInput  
                      id="bill-amount" 
                      label="bill-amount" 
                      defaultValue="0.00"
                      startAdornment={<InputAdornment position={"start"}>$</InputAdornment>}
                      inputProps={{
                          type: "text",
                          pattern: '[0-9]*\\.?[0-9]*'
                      }}
                      onChange={(e) => updateFormFields("amount", e)}/>
                </FormControl>
            </div>
            <div className={styles["single-input"]}>
                <FormControl className={styles["form-control"]} >
                    <InputLabel id="split">Split-Strategy</InputLabel>
                    <Select 
                      labelId="split" 
                      id="split-strategy" 
                      value={formFields["strategy"]}     
                      onChange={(e) => updateFormFields("strategy", e)}>
                        <MenuItem value={"equal"}>Equal</MenuItem>
                        <MenuItem value={"custom"}>Custom</MenuItem>
                    </Select>
                </FormControl>                 
            </div>
            <h4>Amount Owed:</h4>
            <div className={styles["owed"]}>
              {groupMembers.map((gm, idx) => (
                formFields["strategy"] === "equal" ? (
                  <div key={idx} className={styles["owed-item"]}>
                    <span>{gm.username}:</span>
                    <p>${equalAmount}</p>
                  </div>
                ) : (
                  <div key={idx} className={styles["owed-item"]}>
                    <span>{gm.username}:</span>
                    <FormControl 
                      className={styles["form-control"]}>
                      <InputLabel htmlFor={`custom-amount-${idx}`}>Amount</InputLabel>
                      <OutlinedInput  
                        id={`custom-amount-${idx}`}
                        label="custom-amount" 
                        defaultValue="0.00"
                        startAdornment={<InputAdornment position={"start"}>$</InputAdornment>}
                        inputProps={{
                          type: "text",
                          pattern: '[0-9]*\\.?[0-9]*'
                        }}
                        // onSubmit={(e) => handleCustomAmounts(gm.groupname, e)}
                        onChange={(e) => handleCustomAmounts(gm.userid, e)}
                      />
                    </FormControl>
                  </div>
                )
              ))}
            </div>
            {/* <div className={styles["single-input"]}>
                <FormControl className={styles["form-control"]}>
                    <FormLabel>Alert Everyone in the Group?</FormLabel>
                    <RadioGroup defaultValue="Yes" name="alert-everyone-group" onChange={(e) => updateFormFields("alert", e)}>
                        <Radio value="Yes" label="Yes" variant="solid"/> 
                        <Radio value="No" label = "No" variant="solid"/> 
                    </RadioGroup>
                </FormControl>
            </div> */}
            <button type="button" onClick={handlePaymentStart}>Start Payment Split</button>
        </div>
     );
};

export default PaymentPage; 
