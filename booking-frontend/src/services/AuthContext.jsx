import {createContext} from 'react';

export const AuthContext = createContext({
    isLoading: false,
    isAuthenticated: false,
    isAdmin: false,
    isArtist: false
});