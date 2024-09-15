import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register.module.scss';
import Input from '@components/Input';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/user/verify', {
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

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    const validateEmail: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password || !username) {
      setError("Please fill in all fields");
    } else if (validateEmail.test(email) === false) {
      setError("Please enter a valid email address");
      setEmail("");
    } else { 
      try {
        console.log(username, email, password);
        const response = await axios.post('http://localhost:5000/user/signup', {
          email,
          password,
          username
        });
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          navigate('/dashboard');
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          switch (error.response.data.code) {
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
              setError("An error occurred. Please try again.");
              break;
          }
        } else {
          setError("An error occurred. Please try again.");
        }
      }
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