import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/client";
import styles from "./Register.module.scss";
import Input from "@components/Input";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    const validateEmail: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password || !username) {
      setError("Please fill in all fields");
    } else if (validateEmail.test(email) === false) {
      setError("Please enter a valid email address");
      setEmail("");
    } else { 
      await createUserWithEmailAndPassword(auth, email, password).then(
        async (credential) => {
          await updateProfile(credential.user, { displayName: username });
        }
      ).then(() => navigate('/dashboard')).catch((error: any) => {
        switch (error.code) {
          case "auth/email-already-in-use":
            setEmail("");
            setPassword("");
            setError("The email address is already in use by another account");
            break;
          case "auth/invalid-email":
            setEmail("");
            setPassword("");
            setError("The email address is invalid");
            break;
          case "auth/weak-password":
            setPassword("");
            setError("The password must be 6 characters long or more");
            break;
          default:
            break;
        }
      });
    }
  };
  return <main className={styles.main}>
    <div>
      <Link to='/'>
        <img src="/logo.png" alt="logo" />
      </Link>
      <form onSubmit={handleRegister}>
        <Input 
          label='Username' 
          type='text' 
          placeholder='Enter username' 
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Input 
          label='Email' 
          type='text' 
          placeholder='Enter email' 
          value={email}
          onChange={(event) => setEmail(event.target.value)} 
        />
        <Input 
          label='Password' 
          type='password' 
          placeholder='Enter password' 
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          toggleEye
        />
        {error && <div className={styles.error}>{error}</div>}
        <button type='submit'>Make an account</button>
        <div className={styles.login}>
          Already have an account? Login <Link to='/login'>here</Link>
        </div>
      </form>
    </div>
  </main>;
}

export default Register;