import React, {useEffect} from 'react';
import {Navigate} from 'react-router-dom';

const NotFound = () => {
    useEffect(() => {
        console.log("Page not found");
    }, []);

    return <Navigate to="/" replace />;
};

export default NotFound;
