import styles from "../module-styles/Modal.module.css"; 

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
        <div className={styles["modal-overlay"]} onClick={onClose}>
        <div className={styles["modal-content"]} onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>
      
    );
  };
  

export default Modal; 
