import { signInWithEmailAndPassword } from 'firebase/auth';
import styles from './Login.module.scss';
import Input from '@components/Input';
import { auth } from '../firebase/client';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const validateEmail: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      setError("Please fill in all fields");
    } else if (validateEmail.test(email) === false) {
      setError("Please enter a valid email address");
      setEmail("");
    } else {
      const userCred = await signInWithEmailAndPassword(auth, email, password).then(() => navigate('/dashboard')).catch((error) => {
        switch (error.code) {
          case "auth/invalid-credential":
            setEmail("");
            setPassword("");
            setError("The account corresponding to this email does not exist");
            break;
        
          default:
            break;
        }
      })
      console.log(userCred);
    };
  }
  return <main className={styles.main}>
    <div>
      <Link to='/'>
        <img src="/logo.png" alt="logo" />
      </Link>
      <form onSubmit={handleLogin}>
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
        <Link className={styles.forgot} to='/forgot-password'>Forgot Password?</Link>
        {error && <div className={styles.error}>{error}</div>}
        <button type='submit'>Log In</button>
        <div className={styles.register}>
          Don't have an account? Register <Link to='/register'>here</Link>
        </div>
      </form>
    </div>
  </main>;
}

export default Login;