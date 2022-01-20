import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
    const { logout } = useAuth0();
    return (
        <button className=" bg-indigo-600 py-2 px-4 rounded-lg text-white" onClick={() => logout({returnTo: window.location.origin})}>Log out</button>
    )
};

export default LogoutButton;