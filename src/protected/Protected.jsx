import React from 'react'
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../tools/AuthContext";

export function Protected({children}){
    const {user} = useContext(Context);

    if(!user){
        return <Navigate to="/home" replace/>
    }else{
        return children;
    }
}