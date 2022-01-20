import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button className=" bg-indigo-600 py-2 px-4 rounded-lg text-white" onClick={() => loginWithRedirect()}>Log in</button>;
}

export default LoginButton;