import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { AuthContext } from '../../services/AuthContext';
import { CartContext } from '../../services/CartContext';

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
        message: '',
    });
    const { isAuthenticated } = useContext(AuthContext);
    const { addToCart, totalItems } = useContext(CartContext);

    const totalBillets = standardQuantity + premiumQuantity + vipQuantity;

    const prixCategories = {
        standard: 45,
        premium: 75,
        vip: 120
    };

    useEffect(() => {
        setLoading(true);

        const evenements = [
            {
                id: 1,
                nom: "Festival de Jazz de Paris",
                lieu: "Parc de la Villette",
                dateDebut: "2025-04-15",
                dateFin: "2025-04-20",
                description: "Le plus grand festival de jazz d'Europe avec des artistes internationaux et des découvertes locales.",
                image: "https://www.ticketmaster.fr/statics/16-9/bon-plan-eddy-de-pretto_g.webp",
                prix: 35,
                horaires: "19h00 - 23h00",
                artistes: ["Miles Davis Tribute", "Herbie Hancock", "Esperanza Spalding", "Wynton Marsalis"],
                details: "Le Festival de Jazz de Paris revient pour sa 30ème édition avec une programmation exceptionnelle. Venez découvrir les plus grands noms du jazz international ainsi que les talents émergents de la scène française. Au programme : concerts en plein air, jam sessions, masterclasses et bien plus encore."
            },
            {
                id: 2,
                nom: "Concert Symphonique",
                lieu: "Philharmonie de Paris",
                dateDebut: "2025-05-05",
                dateFin: "2025-05-05",
                description: "Une soirée exceptionnelle avec l'Orchestre National de France interprétant les plus grands classiques.",
                image: "https://www.ticketmaster.fr/statics/16-9/bruce-springsteen-lille_g.webp",
                prix: 60,
                horaires: "20h00 - 22h30",
                artistes: ["Orchestre National de France", "Direction: Emmanuel Krivine"],
                details: "L'Orchestre National de France vous convie à une soirée musicale d'exception. Au programme : la Symphonie n°5 de Beethoven, le Concerto pour piano n°2 de Rachmaninov et la Danse Macabre de Saint-Saëns. Un voyage musical à travers les plus grandes œuvres du répertoire classique."
            },
            {
                id: 3,
                nom: "Spectacle de Danse Contemporaine",
                lieu: "La Seine Musicale",
                dateDebut: "2025-05-12",
                dateFin: "2025-05-14",
                description: "Un voyage artistique à travers les plus belles chorégraphies contemporaines avec des danseurs de renommée internationale.",
                image: "https://www.ticketmaster.fr/statics/16-9/calogero_g.webp",
                prix: 40,
                horaires: "20h30 - 22h00",
                artistes: ["Compagnie Marie Chouinard", "Ballet Preljocaj"],
                details: "Ce spectacle exceptionnel réunit les plus grands noms de la danse contemporaine pour trois soirées inoubliables. Des chorégraphies innovantes, des danseurs virtuoses et une mise en scène spectaculaire font de cet événement un rendez-vous à ne pas manquer pour tous les amateurs de danse."
            },
            {
                id: 4,
                nom: "Festival Électro",
                lieu: "Docks de Paris",
                dateDebut: "2025-06-01",
                dateFin: "2025-06-03",
                description: "Trois jours de musique électronique non-stop avec les meilleurs DJs de la scène internationale.",
                image: "https://www.ticketmaster.fr/statics/16-9/gims_g.webp",
                prix: 55,
                horaires: "22h00 - 06h00",
                artistes: ["Daft Punk", "Martin Garrix", "Charlotte de Witte", "Amelie Lens", "Boris Brejcha"],
                details: "Pour sa 10ème édition, le Festival Électro de Paris transforme les Docks en temple de la musique électronique pendant trois jours et trois nuits. Avec 4 scènes, plus de 50 artistes et une expérience immersive totale, cet événement s'impose comme le rendez-vous incontournable pour tous les amateurs de musique électronique."
            },
            {
                id: 5,
                nom: "Exposition d'Art Moderne",
                lieu: "Palais de Tokyo",
                dateDebut: "2025-06-15",
                dateFin: "2025-08-30",
                description: "Une exposition exclusive des œuvres d'artistes contemporains les plus innovants de notre époque.",
                image: "https://www.ticketmaster.fr/statics/16-9/jarry_g.webp",
                prix: 22,
                horaires: "10h00 - 20h00",
                artistes: ["Jean-Michel Basquiat", "Banksy", "Yayoi Kusama", "Jeff Koons"],
                details: "Cette exposition exceptionnelle présente plus de 200 œuvres d'art moderne et contemporain issues des collections privées les plus prestigieuses. Un parcours thématique invite le visiteur à explorer les grandes questions de notre temps à travers le regard d'artistes visionnaires. Visites guidées disponibles en français et en anglais."
            }
        ];

        const foundEvent = evenements.find(e => e.id === parseInt(eventId));

        setTimeout(() => {
            setEvent(foundEvent || null);
            setLoading(false);
        }, 300);
    }, [eventId]);

    // Effet pour masquer la notification après 3 secondes
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

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
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
        navigate('/');
    };

    const handleProcederPaiement = () => {
        if (totalBillets > 0) {
            // Préparation des billets pour le panier
            const cartItems = [];

            if (standardQuantity > 0) {
                cartItems.push({
                    eventId: event.id,
                    eventName: event.nom,
                    date: event.dateDebut,
                    type: "Standard",
                    price: prixCategories.standard,
                    quantity: standardQuantity
                });
            }

            if (premiumQuantity > 0) {
                cartItems.push({
                    eventId: event.id,
                    eventName: event.nom,
                    date: event.dateDebut,
                    type: "Premium",
                    price: prixCategories.premium,
                    quantity: premiumQuantity
                });
            }

            if (vipQuantity > 0) {
                cartItems.push({
                    eventId: event.id,
                    eventName: event.nom,
                    date: event.dateDebut,
                    type: "VIP",
                    price: prixCategories.vip,
                    quantity: vipQuantity
                });
            }

            // Ajout au panier via le contexte
            cartItems.forEach(item => {
                addToCart(item);
            });

            // Fermeture du modal
            setShowModal(false);

            // Affichage de la notification
            setNotification({
                show: true,
                message: `${totalBillets} billet${totalBillets > 1 ? 's' : ''} ajouté${totalBillets > 1 ? 's' : ''} au panier`
            });
        }
    };

    const handleRedirectLogin = () => {
        navigate('/connexion', { state: { returnUrl: `/evenement/${eventId}` } });
    };

    const handleViewCart = () => {
        navigate('/mon-panier');
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
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Événement non trouvé</h2>
                <p className="text-gray-600 mb-8">L'événement que vous recherchez n'existe pas ou a été supprimé.</p>
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
            {/* Toast de notification */}
            {notification.show && (
                <div className="fixed top-20 right-5 z-50 animate-fade-in">
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-center">
                        <Check className="text-green-500 mr-2" size={20} />
                        <div>
                            <p className="font-medium">{notification.message}</p>
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
                        src={event.image || "/api/placeholder/800/500"}
                        alt={event.nom}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-6 px-6">
                        <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium mb-2">
                            À partir de {event.prix} €
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">{event.nom}</h1>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between mb-8">
                        <div className="flex items-start mb-4 md:mb-0">
                            <Calendar size={20} className="text-blue-500 mt-1 mr-2" />
                            <div>
                                <p className="font-medium">Date</p>
                                <p className="text-gray-600">
                                    {formatDate(event.dateDebut)}
                                    {event.dateFin !== event.dateDebut && (
                                        <> au {formatDate(event.dateFin)}</>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start mb-4 md:mb-0">
                            <Clock size={20} className="text-blue-500 mt-1 mr-2" />
                            <div>
                                <p className="font-medium">Horaires</p>
                                <p className="text-gray-600">{event.horaires}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <MapPin size={20} className="text-blue-500 mt-1 mr-2" />
                            <div>
                                <p className="font-medium">Lieu</p>
                                <p className="text-gray-600">{event.lieu}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">À propos de cet événement</h2>
                        <p className="text-gray-700 mb-4">{event.details || event.description}</p>

                        {event.artistes && event.artistes.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold mb-3">Artiste(s)</h3>
                                <div className="flex flex-wrap gap-2">
                                    {event.artistes.map((artiste, index) => (
                                        <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-gray-800">{artiste}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h2 className="text-2xl font-bold mb-4">Réservez vos billets</h2>
                        <p className="text-gray-700 mb-6">Billets à partir de <span className="font-bold text-blue-600">{event.prix} €</span></p>

                        {isAuthenticated ? (
                            <button
                                onClick={handleReserver}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                            >
                                Réserver maintenant
                            </button>
                        ) : (
                            <button
                                onClick={handleRedirectLogin}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                            >
                                Se connecter pour réserver
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
                                <h3 className="text-xl font-bold">Réserver des billets</h3>
                                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-4">
                                <h4 className="font-medium mb-2">{event.nom}</h4>
                                <p className="text-gray-600 text-sm">{formatDate(event.dateDebut)} - {event.lieu}</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Catégorie de billet</label>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium">Billet Standard</p>
                                            <p className="text-gray-600 text-sm">Entrée générale</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <p className="font-bold">{prixCategories.standard} €</p>
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => setStandardQuantity(Math.max(0, standardQuantity - 1))}
                                                    className="w-8 h-8 border border-gray-300 rounded-l flex items-center justify-center hover:bg-gray-100"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={standardQuantity}
                                                    onChange={(e) => setStandardQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                                                    className="w-12 h-8 border-t border-b border-gray-300 text-center"
                                                />
                                                <button
                                                    onClick={() => setStandardQuantity(standardQuantity + 1)}
                                                    className="w-8 h-8 border border-gray-300 rounded-r flex items-center justify-center hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium">Billet Premium</p>
                                            <p className="text-gray-600 text-sm">Placement préférentiel</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <p className="font-bold">{prixCategories.premium} €</p>
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => setPremiumQuantity(Math.max(0, premiumQuantity - 1))}
                                                    className="w-8 h-8 border border-gray-300 rounded-l flex items-center justify-center hover:bg-gray-100"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={premiumQuantity}
                                                    onChange={(e) => setPremiumQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                                                    className="w-12 h-8 border-t border-b border-gray-300 text-center"
                                                />
                                                <button
                                                    onClick={() => setPremiumQuantity(premiumQuantity + 1)}
                                                    className="w-8 h-8 border border-gray-300 rounded-r flex items-center justify-center hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium">Billet VIP</p>
                                            <p className="text-gray-600 text-sm">Accès backstage & cocktail</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <p className="font-bold">{prixCategories.vip} €</p>
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => setVipQuantity(Math.max(0, vipQuantity - 1))}
                                                    className="w-8 h-8 border border-gray-300 rounded-l flex items-center justify-center hover:bg-gray-100"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={vipQuantity}
                                                    onChange={(e) => setVipQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                                                    className="w-12 h-8 border-t border-b border-gray-300 text-center"
                                                />
                                                <button
                                                    onClick={() => setVipQuantity(vipQuantity + 1)}
                                                    className="w-8 h-8 border border-gray-300 rounded-r flex items-center justify-center hover:bg-gray-100"
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
                                disabled={totalBillets === 0}
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