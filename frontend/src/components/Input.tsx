import styles from "./Input.module.scss";
import { useState } from "react";

type InputProps = {
  className?: string;
  label?: string;
  type?: "text" | "password";
  toggleEye?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({className, label, type = "text", toggleEye = false, value, placeholder, onChange}: InputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const viewPassword = () => {setPasswordVisible(!passwordVisible)};
  return (
    <div className={`${styles.main} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      {type === "password" && toggleEye ? 
      <div className={styles.password}>
        <input 
          type={passwordVisible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
        <img src={passwordVisible?'/eye-slash-solid.svg':'/eye-solid.svg'} alt="View Password" onClick={viewPassword} />
      </div>
      :
      <input
        className={styles.text}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      }
    </div>
  );
}

export default Input;