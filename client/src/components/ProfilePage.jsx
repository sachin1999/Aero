import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import { Navigate, useParams } from "react-router";

import PlacesPage from "./PlacesPage";
import AccountNav from "./AccountNav";
import axios from "axios";

export default function ProfilePage() {
    const {ready, user, setUser} = useContext(UserContext);
    const [redirect,setRedirect]= useState(null);
    let {subpage} = useParams();
    if(subpage === undefined) {
        subpage = 'profile';
    }
    async function logout() {
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);
      }
    if(!ready) {
        return 'Loading ...';
    }

    if(ready && !user && !redirect) {
        return <Navigate to={'/login'}/>
    }


    if(redirect) {
        return <Navigate to={redirect}/>
    }
    return (
        <div>
            <AccountNav/>
            {subpage === 'profile' && (
                <div className="text-centern max-w-xl mx-auto ">
                  Logged in as {user.name} ({user.email})
                <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
            {subpage === 'places' && (
                <div>
                   <PlacesPage/>
                </div>
            )}
        </div>
    )
}