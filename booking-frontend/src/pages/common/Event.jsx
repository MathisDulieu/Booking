import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Calendar,
    MapPin,
    Clock,
    ArrowLeft,
    ShoppingCart,
    Check,
} from "lucide-react";
import { AuthContext } from "../../services/AuthContext";
import { CartContext } from "../../services/CartContext";
import { GetEventByIdRequest } from "../../hooks/EventHooks";

function Event() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [standardQuantity, setStandardQuantity] = useState(0);
    const [premiumQuantity, setPremiumQuantity] = useState(0);
    const [vipQuantity, setVipQuantity] = useState(0);
    const [notification, setNotification] = useState({
        show: false,
        message: "",
    });
    const { isAuthenticated } = useContext(AuthContext);
    const { addToCart, totalItems } = useContext(CartContext);

    const totalBillets = standardQuantity + premiumQuantity + vipQuantity;

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            try {
                const response = await GetEventByIdRequest(eventId);
                if (response.informations.event) {
                    setEvent(response.informations.event);
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    useEffect(() => {
        let timer;
        if (notification.show) {
            timer = setTimeout(() => {
                setNotification({ ...notification, show: false });
            }, 3000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [notification]);

    const formatArrayTime = (timeArray) => {
        if (!timeArray) return "";
        const [year, month, day, hour, minute] = timeArray;
        const date = new Date(year, month - 1, day, hour, minute);
        const formattedDate = date.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
        return { date: formattedDate, time: formattedTime };
    };

    const prixCategories = {
        standard: event?.standardTicketsPrice || 45,
        premium: event?.premiumTicketsPrice || 75,
        vip: event?.vipticketsPrice || 120,
    };

    const handleReserver = () => {
        setStandardQuantity(0);
        setPremiumQuantity(0);
        setVipQuantity(0);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const calculerPrixTotal = () => {
        return (
            standardQuantity * prixCategories.standard +
            premiumQuantity * prixCategories.premium +
            vipQuantity * prixCategories.vip
        );
    };

    const handleRetour = () => {
        navigate("/");
    };

    const handleProcederPaiement = () => {
        if (totalBillets > 0 && event) {
            const cartItems = [];

            if (standardQuantity > 0) {
                cartItems.push({
                    eventId: event.id,
                    eventName: event.name,
                    date: formatArrayTime(event.startTime).date,
                    type: "Standard",
                    price: prixCategories.standard,
                    quantity: standardQuantity,
                });
            }

            if (premiumQuantity > 0) {
                cartItems.push({
                    eventId: event.id,
                    eventName: event.name,
                    date: formatArrayTime(event.startTime).date,
                    type: "Premium",
                    price: prixCategories.premium,
                    quantity: premiumQuantity,
                });
            }

            if (vipQuantity > 0) {
                cartItems.push({
                    eventId: event.id,
                    eventName: event.name,
                    date: formatArrayTime(event.startTime).date,
                    type: "VIP",
                    price: prixCategories.vip,
                    quantity: vipQuantity,
                });
            }

            cartItems.forEach((item) => {
                addToCart(item);
            });

            setShowModal(false);

            setNotification({
                show: true,
                message: `${totalBillets} billet${
                    totalBillets > 1 ? "s" : ""
                } ajouté${totalBillets > 1 ? "s" : ""} au panier`,
            });
        }
    };

    const handleRedirectLogin = () => {
        navigate("/connexion", {
            state: { returnUrl: `/evenement/${eventId}` },
        });
    };

    const handleViewCart = () => {
        navigate("/mon-panier");
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Événement non trouvé
                </h2>
                <p className="text-gray-600 mb-8">
                    L'événement que vous recherchez n'existe pas ou a été
                    supprimé.
                </p>
                <button
                    onClick={handleRetour}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Retour aux événements
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 relative">
            {notification.show && (
                <div className="fixed top-20 right-5 z-50 animate-fade-in">
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-center">
                        <Check className="text-green-500 mr-2" size={20} />
                        <div>
                            <p className="font-medium">
                                {notification.message}
                            </p>
                            <button
                                onClick={handleViewCart}
                                className="text-sm text-green-600 underline mt-1 flex items-center"
                            >
                                <ShoppingCart size={14} className="mr-1" />
                                Voir mon panier
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="w-full h-80 relative">
                    <img
                        src={event.imageUrl || "/api/placeholder/800/500"}
                        alt={event.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-6 px-6">
                        <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium mb-2">
                            À partir de {event.minimumPrice} €
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                            {event.name}
                        </h1>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between mb-8">
                        <div className="flex items-start mb-4 md:mb-0">
                            <Calendar
                                size={20}
                                className="text-blue-500 mt-1 mr-2"
                            />
                            <div>
                                <p className="font-medium">Date</p>
                                <p className="text-gray-600">
                                    Du
                                    {" " +
                                        formatArrayTime(event.startTime).date}
                                    {event.endTime &&
                                        event.startTime !== event.endTime && (
                                            <>
                                                {" "}
                                                au{" "}
                                                {
                                                    formatArrayTime(
                                                        event.endTime
                                                    ).date
                                                }
                                            </>
                                        )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start mb-4 md:mb-0">
                            <Clock
                                size={20}
                                className="text-blue-500 mt-1 mr-2"
                            />
                            <div>
                                <p className="font-medium">Horaires</p>
                                <p className="text-gray-600">
                                    {formatArrayTime(event.startTime).time} -{" "}
                                    {formatArrayTime(event.endTime).time}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <MapPin
                                size={20}
                                className="text-blue-500 mt-1 mr-2"
                            />
                            <div>
                                <p className="font-medium">Lieu</p>
                                <p className="text-gray-600">{event.address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">
                            À propos de cet événement
                        </h2>
                        <p className="text-gray-700 mb-4">
                            {event.description}
                        </p>

                        {event.artists && event.artists.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold mb-3">
                                    Artiste(s)
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {event.artists.map((artiste, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-100 px-3 py-1 rounded-full text-gray-800"
                                        >
                                            {artiste}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        {event.availableTickets !== 0 && (
                            <>
                                <h2 className="text-2xl font-bold mb-4">
                                    Réservez vos billets
                                </h2>
                                <p className="text-gray-700 mb-6">
                                    Billets à partir de{" "}
                                    <span className="font-bold text-blue-600">
                                        {event.minimumPrice} €
                                    </span>
                                </p>
                            </>
                        )}
                        {event.availableTickets === 0 ? (
                            <h2 classname="w-full py-3 text-2xl font-bold bg-gray-400 text-white rounded-lg text-center justify-center">
                                Cet événement est complet
                            </h2>
                        ) : (
                            <button
                                onClick={
                                    isAuthenticated
                                        ? handleReserver
                                        : handleRedirectLogin
                                }
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                            >
                                {isAuthenticated
                                    ? "Réserver maintenant"
                                    : "Se connecter pour réserver"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showModal && isAuthenticated && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">
                                    Réserver des billets
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <h4 className="font-medium mb-2">
                                    {event.name}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                    {formatArrayTime(event.startTime).date} -{" "}
                                    {event.address}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">
                                    Billets disponibles :{" "}
                                    {event.availableTickets}
                                </p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">
                                    Catégorie de billet
                                </label>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium">
                                                Billet Standard
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Entrée générale
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Disponibles :{" "}
                                                {event.availableStandardTickets}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <p className="font-bold">
                                                {prixCategories.standard} €
                                            </p>
                                            <div className="flex items-center">
                                                <button
                                                    disabled={
                                                        standardQuantity >=
                                                        event.availableStandardTickets
                                                    }
                                                    onClick={() =>
                                                        setStandardQuantity(
                                                            Math.max(
                                                                0,
                                                                standardQuantity -
                                                                    1
                                                            )
                                                        )
                                                    }
                                                    className="w-8 h-8 border border-gray-300 rounded-l flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={
                                                        event.availableStandardTickets
                                                    }
                                                    value={standardQuantity}
                                                    onChange={(e) =>
                                                        setStandardQuantity(
                                                            Math.max(
                                                                0,
                                                                Math.min(
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    ) || 0,
                                                                    event.availableStandardTickets
                                                                )
                                                            )
                                                        )
                                                    }
                                                    className="w-12 h-8 border-t border-b border-gray-300 text-center"
                                                />
                                                <button
                                                    disabled={
                                                        standardQuantity >=
                                                        event.availableStandardTickets
                                                    }
                                                    onClick={() =>
                                                        setStandardQuantity(
                                                            standardQuantity +
                                                                1,
                                                            event.availableStandardTickets
                                                        )
                                                    }
                                                    className="w-8 h-8 border border-gray-300 rounded-r flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium">
                                                Billet Premium
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Placement préférentiel
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Disponibles :{" "}
                                                {event.availablePremiumTickets}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <p className="font-bold">
                                                {prixCategories.premium} €
                                            </p>
                                            <div className="flex items-center">
                                                <button
                                                    disabled={
                                                        premiumQuantity >=
                                                        event.availablePremiumTickets
                                                    }
                                                    onClick={() =>
                                                        setPremiumQuantity(
                                                            Math.max(
                                                                0,
                                                                premiumQuantity -
                                                                    1
                                                            )
                                                        )
                                                    }
                                                    className="w-8 h-8 border border-gray-300 rounded-l flex items-center justify-center hover:bg-gray-100  disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={
                                                        event.availablePremiumTickets
                                                    }
                                                    value={premiumQuantity}
                                                    onChange={(e) =>
                                                        setPremiumQuantity(
                                                            Math.max(
                                                                0,
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ) || 0,
                                                                event.availablePremiumTickets
                                                            )
                                                        )
                                                    }
                                                    className="w-12 h-8 border-t border-b border-gray-300 text-center"
                                                />
                                                <button
                                                    disabled={
                                                        premiumQuantity >=
                                                        event.availablePremiumTickets
                                                    }
                                                    onClick={() =>
                                                        setPremiumQuantity(
                                                            Math.min(
                                                                premiumQuantity +
                                                                    1,
                                                                event.availablePremiumTickets
                                                            )
                                                        )
                                                    }
                                                    className="w-8 h-8 border border-gray-300 rounded-r flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium">
                                                Billet VIP
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Accès backstage & cocktail
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Disponibles :{" "}
                                                {event.availableVIPTickets}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <p className="font-bold">
                                                {prixCategories.vip} €
                                            </p>
                                            <div className="flex items-center">
                                                <button
                                                    disabled={
                                                        vipQuantity >=
                                                        event.availableVIPTickets
                                                    }
                                                    onClick={() =>
                                                        setVipQuantity(
                                                            Math.max(
                                                                0,
                                                                vipQuantity - 1
                                                            )
                                                        )
                                                    }
                                                    className="w-8 h-8 border border-gray-300 rounded-l flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={
                                                        event.availableVIPTickets
                                                    }
                                                    value={vipQuantity}
                                                    onChange={(e) =>
                                                        setVipQuantity(
                                                            Math.max(
                                                                0,
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ) || 0,
                                                                event.availableVIPTickets
                                                            )
                                                        )
                                                    }
                                                    className="w-12 h-8 border-t border-b border-gray-300 text-center"
                                                />
                                                <button
                                                    disabled={
                                                        vipQuantity >=
                                                        event.availableVIPTickets
                                                    }
                                                    onClick={() =>
                                                        setVipQuantity(
                                                            vipQuantity + 1,
                                                            event.availableVIPTickets
                                                        )
                                                    }
                                                    className="w-8 h-8 border border-gray-300 rounded-r flex items-center justify-center hover:bg-gray-100 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6 font-bold">
                                <p>Total</p>
                                <p>{calculerPrixTotal()} €</p>
                            </div>

                            <button
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                onClick={handleProcederPaiement}
                                disabled={
                                    totalBillets === 0 ||
                                    totalBillets > event.availableTickets
                                }
                            >
                                Ajouter au panier
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Event;
