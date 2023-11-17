import  { createContext, useEffect, useState } from "react";


export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [user,setUser] = useState(null);
    const [ready,setReady] =  useState(false);
    useEffect(() => {
       if(!user) {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        })
          .then(response => {
            response.json().then(user => {
                setUser(user);
                setReady(true);
            });
        });
       } 
    });
    return (
        <UserContext.Provider value={{user,setUser,ready}}>
            {children}
        </UserContext.Provider>
    );
}