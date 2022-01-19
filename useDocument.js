import { useEffect } from "react";
import { projectFireStore } from "../firebase/config";

export const useDocument = (collection, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  //REALTIME DATA LISTENER FOR THE DOCUMENT...WE SET COLLECTION AND THE ID OF THE DOCUMENT IN THE DEPENDENCY ARRAY SO IF ANY OF THEM CHANGES USEEFFECT WILL LISTEN TO IT IN REALTIME
  useEffect(() => {
    const ref = projectFireStore.collection(collection).doc(id); //REFERENCE TO THE DOCUMENT REQUESTED

    //WE FIRE THIS CALLBACK FUNTION EVERYTIME WE GET A SNAPSHOT OF THE REQUESTED DOCUMENT FROM THE FIREBASE
    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        setDocument({ ...snapshot.data(), id: snapshot.id });
        setError(null);
      },
      (error) => {
        console.log(error.message);
        setError("Failed to Document");
      }
    ); //THE SECOND ARGUMENT OF THE ONSNAPSHOT METHOD IS THE ERROR IF WE DIDN'T GET BACK THE SNAPSHOT FROM THE FIREBASE

    return () => {
      unsubscribe();
    }; //CLEAN-UP FUNCTION...THIS FIRES WHENEVER THE COMPONENT WHICH USES THIS HOOK UNMOUNTS
    //AT THIS TIME WE NEED TO UNSUBSCRIBE FROM THE REALTIME DATA FOR THE DOCUMENT
  }, [collection, id]);

  return { document, error };
};
