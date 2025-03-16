import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, element, requiredRole, hasRole }) => {
    if (!isAuthenticated) {
        return <Navigate to="/connexion" replace />;
    }

    if (requiredRole && !hasRole) {
        return <Navigate to="/" replace />;
    }

    return element;
};

export default PrivateRoute;