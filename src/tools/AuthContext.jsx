import React,{ createContext,useState,useEffect } from "react";
import {getAuth, onAuthStateChanged} from 'firebase/auth'

export const Context = createContext();

export function AuthContext({children}){
 const auth = getAuth();
 const [user,setUser] = useState();
 const [loading,setLoading] = useState(true)
 const [path,setPath] = useState(2)
 const tabFeed=(param)=>{
   param===1?setPath(1):param===3?setPath(3):setPath(2)
 }

 useEffect(() => {
    let unsubscribe;
    unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setLoading(false)
        if(currentUser) setUser(currentUser)
        else{setUser(null)}
    });
    return () => {
        if(unsubscribe) unsubscribe();
    }
 },[])
 const values = {
    user: user,
    setUser: setUser
 }

return <Context.Provider value={{...values,path,tabFeed}}>
   {!loading &&
    children
   }
</Context.Provider>
}