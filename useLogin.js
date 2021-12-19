import { useState, useEffect } from "react";
import { projectAuth } from "../firbase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false); //STATES FOR CLEAN-UP FUNCTION
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    //TRYING TO LOGIN THE USER
    try {
      const res = await projectAuth.signInWithEmailAndPassword(email, password);

      //DISPATCHING THE LOGIN ACTION & USE THE RESPONSE.USER AS THE PAYLOAD 
      dispatch({ type: "LOGIN" , payload : res.user});

      //UPDATE STATE
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
      //AFTER DISPATCHING THE LOGIN ACTION WE SET ISPENDING TO BE FALSE AND ERROR TO BE NULL
    } catch (err) {
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  //CLEAN-UP FUNCTION
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, error, isPending };
};
