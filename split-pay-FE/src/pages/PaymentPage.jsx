import { useLocation, useNavigate } from "react-router-dom";
import {useState} from "react"; 
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
const PaymentPage = () => {
    const navigate = useNavigate(); 
    const [formFields, setFormFields] = useState({amount: 150.0, strategy: "equal", "alert": "Yes"}); 
    const loc = useLocation();
    const groupName = loc.state && loc.state.groupName; 
    //also need way to get all members part of group with given "groupName"! 
    const groupMembers = ["Jane", "John", "Steve"]; 
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
        navigate("/status", {state: {groupMembers}}); 
    }
    return (
        <div className={styles["payment-page-container"]}>
            <h3>Payment For {groupName}</h3>
            <div className={styles["single-input"]}>
                <FormControl className={styles["form-control"]}>
                    <InputLabel htmlFor="bill-amount">Amount</InputLabel>
                    <OutlinedInput  
                      id="bill-amount" 
                      label="bill-amount" 
                      defaultValue="150"
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
            {formFields["strategy"] === "equal" && (
                <div className={styles["owed"]}>
                    {groupMembers.map((gm, idx) => {
                        return <div key={idx} className={styles["owed-item"]}>
                            <span>{gm}:</span>
                            <p>${equalAmount}</p>
                        </div>
                    })}
                </div>
            )}
            <div className={styles["single-input"]}>
                <FormControl className={styles["form-control"]}>
                    <FormLabel>Alert Everyone in the Group?</FormLabel>
                    <RadioGroup defaultValue="Yes" name="alert-everyone-group" onChange={(e) => updateFormFields("alert", e)}>
                        <Radio value="Yes" label="Yes" variant="solid"/> 
                        <Radio value="No" label = "No" variant="solid"/> 
                    </RadioGroup>
                </FormControl>
            </div>
            <button type="button" onClick={handlePaymentStart}>Start Payment Split</button>
        </div>
     );
};

export default PaymentPage; 
