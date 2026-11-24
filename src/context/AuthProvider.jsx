
import {
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";

import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import app from "../firebase/firebase.config";

import {
  saveUser,
  getUserProfile,
} from "../services/userApi";


export const AuthContext = createContext(null);

const auth = getAuth(app);


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [profileError, setProfileError] = useState("");


  // Create Firebase account
  const createUser = (email, password) => {

    return createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  };


  // Login with Firebase
  const signIn = (email, password) => {

    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  };


  // Update Firebase display name
  const updateUserProfile = (firebaseUser, name) => {

    return updateProfile(firebaseUser, {
      displayName: name,
    });
  };


  // Save MongoDB profile
  const registerUserProfile = async (
    firebaseUser,
    name
  ) => {

    const data = await saveUser(
      firebaseUser,
      name
    );

    if (auth.currentUser?.uid === firebaseUser.uid) {
      setProfile(data.user);
      setProfileError("");
    }

    return data.user;
  };


  // Load MongoDB profile
  const refreshUserProfile = async (
    firebaseUser = auth.currentUser
  ) => {

    if (!firebaseUser) {
      setProfile(null);
      return null;
    }

    const data = await getUserProfile(firebaseUser);

    if (auth.currentUser?.uid === firebaseUser.uid) {
      setProfile(data.user);
      setProfileError("");
    }

    return data.user;
  };


  // Reset password
  const resetPassword = (email) => {

    return sendPasswordResetEmail(auth, email);
  };


  // Logout
  const logOut = async () => {

    await signOut(auth);

    setUser(null);
    setProfile(null);
    setProfileError("");
  };


  // Observe Firebase authentication
  useEffect(() => {

    let active = true;

    let requestId = 0;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {

        const id = ++requestId;

        setUser(currentUser);
        setLoading(true);
        setProfile(null);
        setProfileError("");

        try {

          if (currentUser) {

            const data = await getUserProfile(
              currentUser
            );

            if (
              active &&
              id === requestId &&
              auth.currentUser?.uid === currentUser.uid
            ) {
              setProfile(data.user);
            }
          }

        } catch (error) {

          if (
            active &&
            id === requestId &&
            error.status !== 404
          ) {
            setProfileError(error.message);
          }

        } finally {

          if (active && id === requestId) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };

  }, []);


  const authInfo = {

    user,

    profile,

    role: profile?.role || null,

    loading,

    profileError,

    createUser,

    signIn,

    updateUserProfile,

    registerUserProfile,

    refreshUserProfile,

    resetPassword,

    logOut,

  };


  return (

    <AuthContext.Provider value={authInfo}>

      {children}

    </AuthContext.Provider>

  );
};


export const useAuth = () => {

  return useContext(AuthContext);
};


export default AuthProvider;
