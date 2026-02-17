import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useRef,
} from 'react';
import type {
  User,
  ConfirmationResult,
} from 'firebase/auth';
import { createOrUpdateUser, isAdmin } from '@/lib/firestore';
import { getFirebaseInstances } from '@/lib/firebase-lazy';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAdminUser: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  sendPhoneOTP: (phone: string) => Promise<ConfirmationResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const firebaseRef = useRef<any>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    // Lazy-load Firebase on mount
    (async () => {
      const firebase = await getFirebaseInstances();
      firebaseRef.current = firebase;

      const { onAuthStateChanged } = await import('firebase/auth');
      
      unsubscribe = onAuthStateChanged(firebase.auth, async (firebaseUser) => {
        setUser(firebaseUser);
        setIsAdminUser(isAdmin(firebaseUser?.email));

        if (firebaseUser) {
          await createOrUpdateUser(firebaseUser.uid, {
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            phone: firebaseUser.phoneNumber || '',
          });
        }
        setLoading(false);
      });
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  async function loginWithEmail(email: string, password: string) {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const firebase = firebaseRef.current || (await getFirebaseInstances());
    await signInWithEmailAndPassword(firebase.auth, email, password);
  }

  async function registerWithEmail(email: string, password: string, name: string) {
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const firebase = firebaseRef.current || (await getFirebaseInstances());
    const cred = await createUserWithEmailAndPassword(firebase.auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await createOrUpdateUser(cred.user.uid, {
      email,
      displayName: name,
    });
  }

  async function loginWithGoogle() {
    const { signInWithPopup } = await import('firebase/auth');
    const firebase = firebaseRef.current || (await getFirebaseInstances());
    const result = await signInWithPopup(firebase.auth, firebase.googleProvider);
    await createOrUpdateUser(result.user.uid, {
      email: result.user.email || '',
      displayName: result.user.displayName || '',
      photoURL: result.user.photoURL || '',
    });
  }

  async function loginWithApple() {
    const { signInWithPopup } = await import('firebase/auth');
    const firebase = firebaseRef.current || (await getFirebaseInstances());
    const result = await signInWithPopup(firebase.auth, firebase.appleProvider);
    await createOrUpdateUser(result.user.uid, {
      email: result.user.email || '',
      displayName: result.user.displayName || '',
      photoURL: result.user.photoURL || '',
    });
  }

  async function sendPhoneOTP(phone: string): Promise<ConfirmationResult> {
    const { RecaptchaVerifier, signInWithPhoneNumber } = await import('firebase/auth');
    const firebase = firebaseRef.current || (await getFirebaseInstances());
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (!recaptchaContainer) throw new Error('reCAPTCHA container not found');
    const verifier = new RecaptchaVerifier(firebase.auth, recaptchaContainer, {
      size: 'invisible',
    });
    return signInWithPhoneNumber(firebase.auth, phone, verifier);
  }

  async function logout() {
    const { signOut } = await import('firebase/auth');
    const firebase = firebaseRef.current || (await getFirebaseInstances());
    await signOut(firebase.auth);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdminUser,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginWithApple,
        sendPhoneOTP,
        logout,
      }}
    >
      {children}
      <div id="recaptcha-container" />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
