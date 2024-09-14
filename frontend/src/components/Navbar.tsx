import styles from './Navbar.module.scss';
import { auth } from '../firebase/client'
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useState } from 'react'

const Navbar = () => {
  const [user, loading] = useAuthState(auth);
  const [recording, setRecording] = useState(false);
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({   
      prompt : "select_account "
    });
    await signInWithPopup(auth, provider);
  }
  const signOutUser = async () => {
    await signOut(auth);
  }
  return <nav className={styles.navbar}>
    <div>
      <img src="/logo.png" alt="Frontend Kevin" />
    </div>
    { 
    user ? <>
      <div className={recording?styles.recording:styles.kevin} onClick={() => setRecording(!recording)}>
        Code with Kevin
        <svg height="800px" width="800px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enable-background="new 0 0 512 512">
          <g>
            <g>
              <path d="m439.5,236c0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,70-64,126.9-142.7,126.9-78.7,0-142.7-56.9-142.7-126.9 0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,86.2 71.5,157.4 163.1,166.7v57.5h-23.6c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h88c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-23.6v-57.5c91.6-9.3 163.1-80.5 163.1-166.7z"/>
              <path d="m256,323.5c51,0 92.3-41.3 92.3-92.3v-127.9c0-51-41.3-92.3-92.3-92.3s-92.3,41.3-92.3,92.3v127.9c0,51 41.3,92.3 92.3,92.3zm-52.3-220.2c0-28.8 23.5-52.3 52.3-52.3s52.3,23.5 52.3,52.3v127.9c0,28.8-23.5,52.3-52.3,52.3s-52.3-23.5-52.3-52.3v-127.9z"/>
            </g>
          </g>
        </svg>
      </div>
      <div className={styles.menu}>
        <span>{user.displayName || 'User'}</span>
        <div className={styles.button} onClick={signOutUser} >
          Logout
        </div>
      </div>
      </>
      :
      <div className={styles.button} onClick={signIn}>Sign up with <img src="/google.svg" alt="google" /></div>
    }
  </nav>;
}

export default Navbar;