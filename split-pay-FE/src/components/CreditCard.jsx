import React from 'react';
import styles from '../module-styles/CreditCard.module.css'; 
import VisaLogo from "../VisaLogo.png";

const CreditCard = ({ cardInfo }) => {
  return (
    <div className={styles.creditCard}>
      <div className={styles.creditCardTop}>
        <div className={styles.creditCardChip}></div>
        <img src={VisaLogo} alt="VISA" className={styles.creditCardLogo} />
      </div>
      <div className={styles.creditCardNumber}>{cardInfo.number}</div>
      <div className={styles.creditCardInfo}>
        <div className={styles.creditCardName}>{cardInfo.name}</div>
        <div className={styles.creditCardExpiry}>Valid Through: {cardInfo.expiry}</div>
      </div>
    </div>
  );
};

export default CreditCard;
