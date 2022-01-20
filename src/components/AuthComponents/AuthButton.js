import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

const AuthButton = () => {
    const { isAuthenticated, isLoading } = useAuth0();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
        </div>
    )
};
export default AuthButton;