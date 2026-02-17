import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type User,
  type ConfirmationResult,
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '@/lib/firebase';
import { createOrUpdateUser, isAdmin } from '@/lib/firestore';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
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
    return unsubscribe;
  }, []);

  async function loginWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function registerWithEmail(email: string, password: string, name: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await createOrUpdateUser(cred.user.uid, {
      email,
      displayName: name,
    });
  }

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    await createOrUpdateUser(result.user.uid, {
      email: result.user.email || '',
      displayName: result.user.displayName || '',
      photoURL: result.user.photoURL || '',
    });
  }

  async function loginWithApple() {
    const result = await signInWithPopup(auth, appleProvider);
    await createOrUpdateUser(result.user.uid, {
      email: result.user.email || '',
      displayName: result.user.displayName || '',
      photoURL: result.user.photoURL || '',
    });
  }

  async function sendPhoneOTP(phone: string): Promise<ConfirmationResult> {
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (!recaptchaContainer) throw new Error('reCAPTCHA container not found');
    const verifier = new RecaptchaVerifier(auth, recaptchaContainer, {
      size: 'invisible',
    });
    return signInWithPhoneNumber(auth, phone, verifier);
  }

  async function logout() {
    await signOut(auth);
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
