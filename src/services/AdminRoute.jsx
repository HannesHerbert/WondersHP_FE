import useAuthStore from "../store/useAuthStore.js";
import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import "../sass/LoadingScreen.scss";


// Schützt alle verschachtelten Routen: nur mit gültigem Token (vom Backend geprüft)
function AdminRoute() {

    const validateToken = useAuthStore((state) => state.validateToken);
    const token = useAuthStore((state) => state.getToken());
    const [tokenIsValid, setTokenIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(Boolean(token));

    useEffect(() => {
        // Ohne Token gar nicht erst beim Backend nachfragen
        if (!token) return;

        validateToken().then((isValid) => {
            setTokenIsValid(isValid);
            setIsLoading(false);
        });
    }, [token]);


    return (

        isLoading ? (<div id="loading-screen"><p>LOADING</p></div>)

        :

        (tokenIsValid ? <Outlet /> : <Navigate to='/login' replace />)

    )
}


export default AdminRoute;
