import styles from './Navbar.module.scss';
import { auth } from '../firebase/client'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'


const Navbar = () => {
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({   
      prompt : "select_account "
    });
    await signInWithPopup(auth, provider);
  }
  return <nav className={styles.navbar}>
    <div>
      <img src="/logo.png" alt="Frontend Kevin" />
    </div>
    <div className={styles.signup} onClick={signIn}>Sign up with <img src="/google.svg" alt="google" /></div>
  </nav>;
}

export default Navbar;