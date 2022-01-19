import { useEffect, useState, useRef } from "react";
import { projectFirestore } from "../firebase/config";

export const useCollection = (collection, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  //IF WE DON'T USE A REF THEN INFINITE LOOP IN USEEFFECT AS QUERY IS AN ARRAY & IS DIFFERENT ON EVERY FUNCTION CALL BECAUSE ITS REFERENCE IS CHANGED IN THE MEMORY EVERYTIME SO USEEFECT SEES IT AS A DIFFERENT ARRAY EVERYTIME SO WE USE A USEREF HOOK
  const query = useRef(_query).current;
  const orderBy = useRef(_orderBy).current;

  useEffect(() => {
    let ref = projectFirestore.collection(collection); //THIS USEEFFECT WILL FIRE AS SOON AS THE COMPONENT USING THIS USECOLLECTION HOOK MOUNTS & HENCE FETCHING THE COLLECTION DATA FROM THE FIRESTORE

    if (query) {
      ref = ref.where(...query); //FOR ONLY FETCHING DATA OF THE USER HAVING USER.ID == UID....PASSED AS A PROP FROM THE HOME PAGE COMPONENT IN FORM OF AN ARRAY
    }

    if (orderBy) {
      ref = ref.orderBy(...orderBy); //FOR ORDERING THE DOCUMENTS IN THE TRANSACTION LIST BASED ON THE PROPERTY CREATEDAT & IN DESC ORDER BOTH PASSED AS A PROPS FROM THE HOME COMPONENT IN FORM OF AN ARRAY
    }

    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id }); //WE ARE CREATING A NEW OBJECT FOR EACH DOCUMENT WE HAVE & PUSHING IN OUR RESULTS ARRAY
          //EACH DOCUMENT HAVE ALL ITS DATA AND A DOC ID
        });

        //UPDATE STATE
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("Could not fetch the data");
      }
    );
    //A SNAPSHOT REPRESENTS THE COLLECTION AT THAT PARTICULAR TIME IT WAS TAKEN
    //THIS CALLBACK FUNCTION i.e THE FIRST ARGUMENT INT HE ONSNAPSHOT FUNCTION FIRES EVERYTIME THE FIRSTORE COLLECTION CHANGES AND SENDS BACK A SNAPSHOT
    //WE WILL USE THIS SNAPSHOT TO UPDATE OUR STATES
    //THE SECOND ARGUMENT OF THE ONSNAPSHOT FUNCTION IS A FUNCTION WHICH IS FIRED WHEN WE GET BACK AN ERROR
    //THIS IS HOW WE MAINTAIN A REALTIME LISTENING TO OUR DATABASE

    //UNSUBSCRIBE ON UNMOUNTING THE COMPONENT WHICH IS USING THIS HOOK
    return () => unsubscribe();
  }, [collection, query, orderBy]);

  return { documents, error };
};
