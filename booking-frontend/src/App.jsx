import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";

import {AuthContext} from './services/AuthContext';

import PrivateRoute from "./services/PrivateRoute";
import PublicRoute from "./services/PublicRoute";

import Header from "./components/structure/header.jsx";
import Footer from "./components/structure/footer.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Login from "./pages/authentication/Login.jsx";
import Register from "./pages/authentication/Register.jsx";
import SendValidationEmail from "./pages/authentication/SendValidationEmail.jsx";
import ValidEmail from "./pages/authentication/ValidEmail.jsx";
import Home from "./pages/common/Home.jsx";
import Event from "./pages/common/Event.jsx";
import NotFound from "./pages/common/NotFound.jsx";
import Account from "./pages/user/Account.jsx";
import Tickets from "./pages/user/Tickets.jsx";
import Cart from "./pages/user/Cart.jsx";
import ArtistDashboard from "./pages/artist/ArtistDashboard.jsx";


export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isArtist, setIsArtist] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const getUserDetails = async () => {
        // try {
        //     const response = await getUserData();
        //
        //     if (response.informations) {
        //         const userInfo = {
        //             username: response.informations.username || "undefined",
        //             profileImageUrl: response.informations.profileImageUrl || "undefined",
        //             userRole: response.informations.userRole || "USER",
        //             error: response.informations.error
        //         };
        //
        //         setIsAdmin(userInfo.userRole === "ADMIN");
        //         setIsArtist(userInfo.userRole === "ARTIST");
        //
        //         localStorage.setItem("username", userInfo.username);
        //         localStorage.setItem("profileImage", userInfo.profileImageUrl);
        //         localStorage.setItem("userRole", userInfo.userRole);
        //         setIsAuthenticated(true)
        //     }
        // } catch (error) {
        //     console.error("Failed to fetch User:", error);
        // }
    };

    useEffect(() => {
        getUserDetails().then(() => {
            setIsLoading(false);
            setIsAuthenticated(true)
        });
    }, []);

    return (
        <AuthContext.Provider value={{
            isLoading,
            setIsLoading,
            isAuthenticated,
            setIsAuthenticated,
            isAdmin,
            setIsAdmin,
            isArtist,
            setIsArtist
        }}>
            <BrowserRouter>
                <div className="App">
                    <Routes>
                        {isLoading ? (
                            <Route path="/*" element={<div>Chargement...</div>} />
                        ) : (
                            <Route path="/*" element={<Main isAuthenticated={isAuthenticated} isAdmin={isAdmin} isArtist={isArtist} />} />
                        )}
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

function Main({ isAuthenticated, isAdmin, isArtist }) {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith("/admin");
    const isArtistPage = location.pathname.startsWith("/artist")

    return (
        <div className="flex flex-col min-h-screen">
            {!isAdminPage && (
                <header className="App-header">
                    <Header />
                </header>
            )}

            <main className="App-main flex-grow">
                <Routes>
                    <Route exact path="/" element={<div className="Main"><Home /></div>} />

                    <Route exact path="/connexion" element={<PublicRoute isAuthenticated={isAuthenticated} element={<div className="Main"><Register /></div>} />} />
                    <Route exact path="/inscription" element={<PublicRoute isAuthenticated={isAuthenticated} element={<div className="Main"><Login /></div>} />} />
                    <Route exact path="/valider-email/:token" element={<PublicRoute element={<div className="Main"><ValidEmail /></div>} />} />
                    <Route exact path="/envoyer-email-validation" element={<PublicRoute element={<div className="Main"><SendValidationEmail /></div>} />} />
                    <Route exact path="/evenement/:eventId" element={<PublicRoute element={<div className="Main"><Event /></div>} />} />

                    <Route exact path="/admin/tableau-de-bord" element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            requiredRole="admin"
                            hasRole={isAdmin}
                            element={<div className="Main"><AdminDashboard /></div>}
                        />
                    } />

                    <Route exact path="/mon-compte" element={<PrivateRoute isAuthenticated={isAuthenticated} element={<div className="Main"><Account /></div>} />} />
                    <Route exact path="/mes-tickets" element={<PrivateRoute isAuthenticated={isAuthenticated} element={<div className="Main"><Tickets /></div>} />} />
                    <Route exact path="/mon-panier" element={<PrivateRoute isAuthenticated={isAuthenticated} element={<div className="Main"><Cart /></div>} />} />

                    <Route exact path="/artiste/tableau-de-bord" element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            requiredRole="artist"
                            hasRole={isArtist}
                            element={<div className="Main"><ArtistDashboard /></div>}
                        />
                    } />

                    <Route exact path="*" element={<div className="Main"><NotFound /></div>} />
                </Routes>
            </main>

            {!isAdminPage && (
                <footer className="App-footer mt-auto">
                    <Footer />
                </footer>
            )}
        </div>
    );
}