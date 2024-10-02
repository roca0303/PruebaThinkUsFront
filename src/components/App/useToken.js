import { useState } from 'react';

export default function useToken() {

    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        let date = new Date(userToken?.expires_at);
        let today = new Date();
        today.setHours(today.getHours()+5);
        // console.log("hora de token " + date);
        // console.log("hora actual " +today);
        if ( date < today )
        {
            sessionStorage.setItem('token', null);
            return null;
        }
        return userToken?.access_token;
    };

    const saveToken = userToken => {
        sessionStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
        console.log("si voy bien");
        window.location.reload();
    };

    const [token, setToken] = useState(getToken());

    return {
        setToken: saveToken,
        token
    }
}   