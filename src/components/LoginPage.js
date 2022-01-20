import React from "react";
import AuthButton from "./AuthComponents/AuthButton";

const LoginPage = () => {
    return (
        <div className="text-3xl flex flex-col bg-gray-200 h-screen justify-center items-center"> 
            <div>
                Please log in to use the assignment tracker.
            </div>
            <AuthButton />
        </div>
    )
};

export default LoginPage;