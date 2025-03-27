import React, { useState, useContext } from 'react';
import logoImage from '../../assets/images/logo/EventHubLogo.png';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../services/AuthContext';
import { CartContext } from '../../services/CartContext';
import { LayoutDashboard, Menu, Search, X, ShoppingCart } from 'lucide-react';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCategory, setSearchCategory] = useState('EVENT');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const { isAuthenticated, isAdmin, isArtist } = useContext(AuthContext);
    const { totalPrice, totalItems } = useContext(CartContext);
    const navigate = useNavigate();

    const categories = [
        'EVENT',
        'ARTIST',
        'CONCERT',
        'FESTIVAL'
    ];

    const handleSearch = () => {
        if(!searchTerm.trim()) return;

        const searchParams = new URLSearchParams();
        searchParams.append('filter', searchCategory);
        searchParams.append('search', searchTerm.trim());

        navigate(`/?${searchParams.toString()}`);

        setMobileSearchOpen(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const getDashboardUrl = () => {
        if (isAdmin) return "/admin/tableau-de-bord";
        if (isArtist) return "/artiste/tableau-de-bord";
        return "/";
    };

    return (
        <header className="bg-blue-700 shadow-md">
            <div className="container mx-auto px-4 py-3 lg:py-6 flex items-center justify-between">
                <div className="md:w-40 lg:w-56 flex-shrink-0">
                    <Link to="/">
                        <div
                            className="h-10 md:h-12 lg:h-16 bg-contain bg-center bg-no-repeat cursor-pointer"
                            style={{
                                backgroundImage: `url(${logoImage})`
                            }}
                            alt="EventHub Logo"
                        ></div>
                    </Link>
                </div>

                <div className="flex md:hidden">
                    <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="p-2 mr-2 text-white">
                        <Search size={24} />
                    </button>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white">
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div className="w-full max-w-md lg:max-w-xl xl:max-w-2xl bg-white rounded-md hidden md:flex items-center mx-4 border border-blue-500 focus-within:ring-2 focus-within:ring-blue-300">
                    <select
                        className="bg-transparent uppercase font-bold text-xs lg:text-sm p-2 lg:p-4 mr-2 lg:mr-4 cursor-pointer hover:bg-gray-100 transition duration-300 text-blue-800"
                        name="categories"
                        id="categories"
                        onChange={(e) => setSearchCategory(e.target.value)}
                        value={searchCategory}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category === "EVENT"
                                    ? "Events"
                                    : category === "CONCERT"
                                        ? "Concerts"
                                        : category === "FESTIVAL"
                                            ? "Festivals"
                                            : category === "ARTIST"
                                                ? "Artists"
                                                : category}
                            </option>
                        ))}
                    </select>
                    <input
                        className="border-l border-gray-300 bg-transparent font-semibold text-sm pl-4 py-2 lg:py-3 flex-grow focus:outline-none text-gray-800"
                        type="text"
                        placeholder="I'm looking for an event..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <svg
                        className="h-6 px-4 text-blue-600 cursor-pointer hover:text-blue-800 transition duration-300"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="far"
                        data-icon="search"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        onClick={handleSearch}
                    >
                        <path fill="currentColor" d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"></path>
                    </svg>
                </div>

                <div className="hidden md:flex items-center">
                    {isAuthenticated ? (
                        <>
                            <nav className="contents">
                                <ul className="flex items-center justify-end">
                                    <li className="ml-2 lg:ml-4 relative inline-block">
                                        <Link to="/mon-compte" className="block transform hover:scale-110 transition duration-300">
                                            <svg className="h-10 lg:h-12 p-2 text-white hover:text-blue-100" aria-hidden="true" focusable="false" data-prefix="far" data-icon="user" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z"></path></svg>
                                        </Link>
                                    </li>

                                    {(isAdmin || isArtist) ? (
                                        <li className="ml-2 lg:ml-4 relative inline-block">
                                            <Link to={getDashboardUrl()} className="block transform hover:scale-110 transition duration-300">
                                                <div className="flex items-center justify-center h-10 lg:h-12 p-2 text-white hover:text-blue-100">
                                                    <LayoutDashboard className="lg:w-9 lg:h-9 w-7 h-7" />
                                                </div>
                                            </Link>
                                        </li>
                                    ) : (
                                        <li className="ml-2 lg:ml-4 relative inline-block">
                                            <Link to="/mon-panier" className="block transform hover:scale-110 transition duration-300">
                                                {totalItems > 0 && (
                                                    <div className="absolute -top-1 right-0 z-10 bg-yellow-400 text-blue-900 text-xs font-bold px-1 py-0.5 rounded-sm">
                                                        {totalItems}
                                                    </div>
                                                )}
                                                <svg className="h-10 lg:h-12 p-2 text-white hover:text-blue-100" aria-hidden="true" focusable="false" data-prefix="far" data-icon="shopping-cart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M551.991 64H144.28l-8.726-44.608C133.35 8.128 123.478 0 112 0H12C5.373 0 0 5.373 0 12v24c0 6.627 5.373 12 12 12h80.24l69.594 355.701C150.796 415.201 144 430.802 144 448c0 35.346 28.654 64 64 64s64-28.654 64-64a63.681 63.681 0 0 0-8.583-32h145.167a63.681 63.681 0 0 0-8.583 32c0 35.346 28.654 64 64 64 35.346 0 64-28.654 64-64 0-18.136-7.556-34.496-19.676-46.142l1.035-4.757c3.254-14.96-8.142-29.101-23.452-29.101H203.76l-9.39-48h312.405c11.29 0 21.054-7.869 23.452-18.902l45.216-208C578.695 78.139 567.299 64 551.991 64zM208 472c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm256 0c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm23.438-200H184.98l-31.31-160h368.548l-34.78 160z"></path></svg>
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </nav>

                            <div className="ml-2 lg:ml-4 hidden xl:flex flex-col font-bold text-white">
                                {!(isAdmin || isArtist) && (
                                    <>
                                        <span className="text-xs text-white">Your Cart</span>
                                        <span className="text-sm">{totalPrice.toFixed(2)} €</span>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link to="/connexion" className="bg-white text-blue-700 font-bold text-xs md:text-sm py-2 px-2 md:px-4 whitespace-nowrap rounded-md hover:bg-blue-100 transition duration-300">
                            Sign in
                        </Link>
                    )}
                </div>
            </div>

            {mobileSearchOpen && (
                <div className="md:hidden p-4 bg-blue-700">
                    <div className="flex items-center">
                        <select
                            className="bg-white uppercase font-bold text-xs p-2 mr-2 rounded-l-md cursor-pointer text-blue-800"
                            name="mobileCategories"
                            id="mobileCategories"
                            onChange={(e) => setSearchCategory(e.target.value)}
                            value={searchCategory}
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === "EVENT"
                                        ? "Events"
                                        : category === "CONCERT"
                                            ? "Concerts"
                                            : category === "FESTIVAL"
                                                ? "Festivals"
                                                : category === "ARTIST"
                                                    ? "Artists"
                                                    : category}
                                </option>
                            ))}
                        </select>
                        <input
                            className="bg-white font-semibold text-sm pl-4 py-2 flex-grow focus:outline-none text-gray-800"
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            className="bg-white p-2 rounded-r-md text-blue-600"
                            onClick={handleSearch}
                        >
                            <Search size={20} />
                        </button>
                    </div>
                </div>
            )}

            {mobileMenuOpen && (
                <div className="md:hidden p-4 bg-blue-700">
                    <nav>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="flex items-center text-white font-medium py-2 px-3 rounded-md hover:bg-blue-800 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
                                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                    </svg>
                                    Home
                                </Link>
                            </li>
                            {isAuthenticated ? (
                                <>
                                    <li>
                                        <Link to="/mon-compte" className="flex items-center text-white font-medium py-2 px-3 rounded-md hover:bg-blue-800 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
                                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                            My Account
                                        </Link>
                                    </li>
                                    {(isAdmin || isArtist) && (
                                        <li>
                                            <Link to={getDashboardUrl()} className="flex items-center text-white font-medium py-2 px-3 rounded-md hover:bg-blue-800 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
                                                <LayoutDashboard className="h-5 w-5 mr-2" />
                                                {isAdmin ? "Admin Dashboard" : "Artist Dashboard"}
                                            </Link>
                                        </li>
                                    )}
                                    {!(isAdmin || isArtist) && (
                                        <li>
                                            <Link to="/mon-panier" className="flex items-center text-white font-medium py-2 px-3 rounded-md hover:bg-blue-800 transition duration-300" onClick={() => setMobileMenuOpen(false)}>
                                                <ShoppingCart className="h-5 w-5 mr-2" />
                                                Cart
                                                <span className="ml-2">({totalPrice.toFixed(2)} €)</span>
                                                {totalItems > 0 && (
                                                    <span className="ml-2 bg-yellow-400 text-blue-900 text-xs font-bold px-2 py-0.5 rounded">
                                                        {totalItems}
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                    )}
                                </>
                            ) : (
                                <li>
                                    <Link
                                        to="/connexion"
                                        className="flex items-center justify-center bg-white text-blue-700 font-bold py-2 px-4 rounded-md hover:bg-blue-100 transition duration-300"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                                        </svg>
                                        Sign in
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            )}

            <hr className="border-blue-600" />
        </header>
    );
};

export default Header;