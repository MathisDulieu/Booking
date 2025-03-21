import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";

import {AuthContext} from './services/AuthContext';
import {CartProvider} from './services/CartProvider'; // Importation du CartProvider

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
import Cart from "./pages/user/Cart.jsx";
import ArtistDashboard from "./pages/artist/ArtistDashboard.jsx";


export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isArtist, setIsArtist] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const getUserDetails = async () => {
        // votre code de récupération des données utilisateur
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
            <CartProvider> {/* Ajout du CartProvider qui enveloppe le BrowserRouter */}
                <BrowserRouter>
                    <div className="App">
                        <Routes>
                            {isLoading ? (
                                <Route path="/*" element={<div>Chargement...</div>} />
                            ) : (
                                <Route path="/*" element={<PageLayout isAuthenticated={isAuthenticated} isAdmin={isAdmin} isArtist={isArtist} />} />
                            )}
                        </Routes>
                    </div>
                </BrowserRouter>
            </CartProvider>
        </AuthContext.Provider>
    );
}

function PageLayout({ isAuthenticated, isAdmin, isArtist }) {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith("/admin");

    // Ajoutez un style global pour supprimer la double barre de défilement
    React.useEffect(() => {
        // Supprime toute barre de défilement supplémentaire
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";

        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };
    }, [location.pathname]);

    return (
        <>
            {!isAdminPage && <Header />}
            <div className="page-content">
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/connexion" element={<PublicRoute isAuthenticated={isAuthenticated} element={<Login />} />} />
                    <Route exact path="/inscription" element={<PublicRoute isAuthenticated={isAuthenticated} element={<Register />} />} />
                    <Route exact path="/valider-email/:token" element={<PublicRoute element={<ValidEmail />} />} />
                    <Route exact path="/envoyer-email-validation" element={<PublicRoute element={<SendValidationEmail />} />} />
                    <Route exact path="/evenement/:eventId" element={<PublicRoute element={<Event />} />} />

                    <Route exact path="/admin/tableau-de-bord" element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            requiredRole="admin"
                            hasRole={isAdmin}
                            element={<AdminDashboard />}
                        />
                    } />

                    <Route exact path="/mon-compte" element={<PrivateRoute isAuthenticated={isAuthenticated} element={<Account />} />} />
                    <Route exact path="/mon-panier" element={<PrivateRoute isAuthenticated={isAuthenticated} element={<Cart />} />} />

                    <Route exact path="/artiste/tableau-de-bord" element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            requiredRole="artist"
                            hasRole={isArtist}
                            element={<ArtistDashboard />}
                        />
                    } />

                    <Route exact path="*" element={<NotFound />} />
                </Routes>
            </div>
            {!isAdminPage && <Footer />}
        </>
    );
}