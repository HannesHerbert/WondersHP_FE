import useAuthStore from "../store/useAuthStore.js";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../sass/LoadingScreen.scss";



function AdminRoute() {

    const user = useAuthStore(state => state.user);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated());
    const validateToken = useAuthStore((state) => state.validateToken);
    const location = useLocation();
    const [tokenIsValid, setTokenIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkForValidToken = async() => {
        const isValid = await validateToken()
        setTokenIsValid(isValid);
        setIsLoading(false);
    }
    
    useEffect (() => {
        checkForValidToken();
    }, [])
    

    return (        

        isLoading ? (<div id="loading-screen"><p>LOADING</p></div>)
        
        :
        
        (tokenIsValid ? <Outlet /> : <Navigate to='/' replace />)
        
    )
}


export default AdminRoute;