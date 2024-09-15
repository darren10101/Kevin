import axios from 'axios';
import styles from './Login.module.scss';
import Input from '@components/Input';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://127.0.0.1:5000/user/verify', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            window.location.reload();
          }
        } catch (error) {
          console.error('Error verifying token:', error);
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const validateEmail: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      setError("Please fill in all fields");
    } else if (validateEmail.test(email) === false) {
      setError("Please enter a valid email address");
      setEmail("");
    } else {
      try {
        const response = await axios.post('http://127.0.0.1:5000/user/login', {
          email,
          password
        });
        if (response.status === 200) {
          // Save the JWT token in local storage
          localStorage.setItem('token', response.data.token);
          window.location.reload();
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          switch (error.response.data.code) {
            case "auth/invalid-credential":
              setEmail("");
              setPassword("");
              setError("The account corresponding to this email does not exist");
              break;
            default:
              setError("An error occurred. Please try again.");
              break;
          }
        } else {
          setError("An error occurred. Please try again.");
        }
      }
    }
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