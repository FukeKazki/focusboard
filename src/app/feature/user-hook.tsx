import { User, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";

type AuthContextProps = {
  currentUser: User | null | undefined;
};

const FirebaseAuthContext = createContext<AuthContextProps>({
  currentUser: undefined,
});

type Props = {
  children?: React.ReactNode;
};

export const FirebaseAuthProvider: React.FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  );

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => setCurrentUser(user));
  }, []);

  return (
    <FirebaseAuthContext.Provider value={{ currentUser }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export const useUser = () => useContext(FirebaseAuthContext);
