import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, ShoppingCart, AlertTriangle, CheckCircle, Info, Clock } from 'lucide-react';

function NotificationsSection() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allNotificationsEnabled, setAllNotificationsEnabled] = useState(true);
    const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
    const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
    const [smsNotificationsEnabled, setSmsNotificationsEnabled] = useState(false);

    useEffect(() => {
        // Simulation d'un appel API pour récupérer les notifications
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                // Dans un cas réel, ce serait un appel fetch() vers votre API
                // Ici on simule les données
                const mockNotifications = [
                    {
                        id: 1,
                        type: 'info',
                        title: 'Mise à jour des conditions de service',
                        message: 'Nos conditions de service ont été mises à jour. Veuillez les consulter.',
                        date: '2025-03-15T10:30:00',
                        read: false,
                    },
                    {
                        id: 2,
                        type: 'success',
                        title: 'Commande expédiée',
                        message: 'Votre commande #12345 a été expédiée et sera livrée dans 2-3 jours.',
                        date: '2025-03-14T16:45:00',
                        read: true,
                    },
                    {
                        id: 3,
                        type: 'warning',
                        title: 'Votre abonnement expire bientôt',
                        message: 'Votre abonnement premium expire dans 5 jours. Renouvelez-le pour continuer à profiter de tous les avantages.',
                        date: '2025-03-13T09:15:00',
                        read: false,
                    },
                    {
                        id: 4,
                        type: 'error',
                        title: 'Échec de paiement',
                        message: 'Le paiement de votre facture mensuelle a échoué. Veuillez mettre à jour vos informations de paiement.',
                        date: '2025-03-12T14:20:00',
                        read: true,
                    },
                    {
                        id: 5,
                        type: 'message',
                        title: 'Nouveau message',
                        message: 'Vous avez reçu un nouveau message de l\'équipe support concernant votre demande récente.',
                        date: '2025-03-11T11:05:00',
                        read: false,
                    }
                ];

                // Simuler un délai réseau
                setTimeout(() => {
                    setNotifications(mockNotifications);
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error("Erreur lors de la récupération des notifications:", error);
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return "Aujourd'hui, " + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        } else if (diffInDays === 1) {
            return "Hier, " + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        } else if (diffInDays < 7) {
            const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
            return days[date.getDay()] + ', ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        }
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'info':
                return <Info size={20} className="text-blue-500" />;
            case 'success':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'warning':
                return <AlertTriangle size={20} className="text-yellow-500" />;
            case 'error':
                return <AlertTriangle size={20} className="text-red-500" />;
            case 'message':
                return <MessageSquare size={20} className="text-purple-500" />;
            default:
                return <Bell size={20} className="text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 sm:py-16 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Préférences de notifications</h1>

                <div className="mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Paramètres de notification</h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center">
                                <Bell size={20} className="text-gray-500 mr-3" />
                                <span className="text-gray-800 font-medium">Toutes les notifications</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={allNotificationsEnabled}
                                    onChange={() => setAllNotificationsEnabled(!allNotificationsEnabled)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b pl-8">
                            <div className="flex items-center">
                                <Mail size={18} className="text-gray-500 mr-3" />
                                <span className="text-gray-700">Notifications par email</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={emailNotificationsEnabled && allNotificationsEnabled}
                                    onChange={() => setEmailNotificationsEnabled(!emailNotificationsEnabled)}
                                    disabled={!allNotificationsEnabled}
                                />
                                <div className={`w-11 h-6 ${!allNotificationsEnabled ? 'bg-gray-100' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b pl-8">
                            <div className="flex items-center">
                                <SmartphoneNotif size={18} className="text-gray-500 mr-3" />
                                <span className="text-gray-700">Notifications push</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={pushNotificationsEnabled && allNotificationsEnabled}
                                    onChange={() => setPushNotificationsEnabled(!pushNotificationsEnabled)}
                                    disabled={!allNotificationsEnabled}
                                />
                                <div className={`w-11 h-6 ${!allNotificationsEnabled ? 'bg-gray-100' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-2 pl-8">
                            <div className="flex items-center">
                                <MessageSquare size={18} className="text-gray-500 mr-3" />
                                <span className="text-gray-700">Notifications SMS</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={smsNotificationsEnabled && allNotificationsEnabled}
                                    onChange={() => setSmsNotificationsEnabled(!smsNotificationsEnabled)}
                                    disabled={!allNotificationsEnabled}
                                />
                                <div className={`w-11 h-6 ${!allNotificationsEnabled ? 'bg-gray-100' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Dernières notifications</h2>
                        {notifications.some(n => !n.read) && (
                            <button
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                onClick={markAllAsRead}
                            >
                                <CheckCircle size={16} className="mr-1" />
                                Tout marquer comme lu
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4">
                                <Bell size={64} className="text-gray-300 w-full h-full" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Aucune notification</h3>
                            <p className="text-gray-500">Vous n'avez pas encore reçu de notifications.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${
                                        notification.read ? 'border-gray-200' :
                                            notification.type === 'info' ? 'border-blue-500' :
                                                notification.type === 'success' ? 'border-green-500' :
                                                    notification.type === 'warning' ? 'border-yellow-500' :
                                                        notification.type === 'error' ? 'border-red-500' :
                                                            'border-purple-500'
                                    }`}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className={`text-base font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                                    {notification.title}
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    {!notification.read && (
                                                        <button
                                                            className="text-blue-600 hover:text-blue-800"
                                                            onClick={() => markAsRead(notification.id)}
                                                            title="Marquer comme lu"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        className="text-gray-400 hover:text-gray-600"
                                                        onClick={() => deleteNotification(notification.id)}
                                                        title="Supprimer"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'} mt-1`}>
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center mt-2 text-xs text-gray-500">
                                                <Clock size={14} className="mr-1" />
                                                {formatDate(notification.date)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Composants personnalisés pour les icônes manquantes
function Mail({ size, className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
    );
}

function SmartphoneNotif({ size, className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
            <path d="M12 18h.01"></path>
            <path d="M18 7c1.1 0 2 .9 2 2v.5a2.5 2.5 0 0 1-2.5 2.5.2.2 0 0 0-.2.2v.8a.2.2 0 0 0 .2.2 2.5 2.5 0 0 1 2.5 2.5v.5c0 1.1-.9 2-2 2"></path>
        </svg>
    );
}

function Trash({ size, className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
    );
}

export default NotificationsSection;