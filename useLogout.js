import { useState, useEffect } from "react";
import { projectAuth } from "../firbase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false); //STATES FOR CLEAN-UP FUNCTION
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(null);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    //TRYING TO LOGOUT THE USER
    try {
      await projectAuth.signOut();

      //DISPATCHING THE LOGOUT ACTION & WE DONT NEED ANY PAYLOAD FOR LOGGING OUT JUST THE ACTION TYPE
      dispatch({ type: "LOGOUT" });

      //UPDATE STATE
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
      //AFTER DISPATCHING THE LOGOUT ACTION WE SET ISPENDING TO BE FALSE AND ERROR TO BE NULL
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

  return { logout, error, isPending };
};
