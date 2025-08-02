// context/SignupContext.jsx
import { createContext, useContext, useState } from 'react';

export const SigninCOntext = createContext();

export const SigninProvider = ({ children }) => {
  const [signin, setSignin] = useState(false);
  return (
    <SigninCOntext.Provider value={{ signin, setSignin }}>
      {children}
    </SigninCOntext.Provider>
  );
};
