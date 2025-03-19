import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Download, QrCode } from 'lucide-react';

function TicketsSection() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTicket, setActiveTicket] = useState(null);

    useEffect(() => {
        // Simulation d'un appel API pour récupérer les tickets
        const fetchTickets = async () => {
            setLoading(true);
            try {
                // Dans un cas réel, ce serait un appel fetch() vers votre API
                // Ici on simule les données
                const mockTickets = [
                    {
                        id: "TKT-2025-1234",
                        eventId: 1,
                        eventName: "Festival de Jazz de Paris",
                        location: "Parc de la Villette, Paris",
                        date: "2025-04-15",
                        time: "19h00 - 23h00",
                        type: "VIP",
                        price: 120,
                        qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TKT-2025-1234",
                        status: "valid",
                        purchaseDate: "2025-01-10"
                    },
                    {
                        id: "TKT-2025-5678",
                        eventId: 2,
                        eventName: "Concert Symphonique",
                        location: "Philharmonie de Paris",
                        date: "2025-05-05",
                        time: "20h00 - 22h30",
                        type: "Premium",
                        price: 75,
                        qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TKT-2025-5678",
                        status: "valid",
                        purchaseDate: "2025-01-15"
                    },
                    {
                        id: "TKT-2025-9012",
                        eventId: 3,
                        eventName: "Spectacle de Danse Contemporaine",
                        location: "La Seine Musicale",
                        date: "2025-05-12",
                        time: "20h30 - 22h00",
                        type: "Standard",
                        price: 45,
                        qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TKT-2025-9012",
                        status: "valid",
                        purchaseDate: "2025-02-01"
                    },
                    {
                        id: "TKT-2025-3456",
                        eventId: 4,
                        eventName: "Festival Électro",
                        location: "Docks de Paris",
                        date: "2025-06-01",
                        time: "22h00 - 06h00",
                        type: "VIP",
                        price: 120,
                        qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TKT-2025-3456",
                        status: "used",
                        purchaseDate: "2024-12-20"
                    }
                ];

                // Simuler un délai réseau
                setTimeout(() => {
                    setTickets(mockTickets);
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error("Erreur lors de la récupération des tickets:", error);
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    const handleShowQRCode = (ticketId) => {
        setActiveTicket(ticketId === activeTicket ? null : ticketId);
    };

    const handleDownloadTicket = (ticket) => {
        console.log('Téléchargement du billet:', ticket.id);
        // Ici vous implémenteriez la logique pour générer/télécharger un PDF
        alert(`Le billet pour "${ticket.eventName}" va être téléchargé.`);
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Mes Billets</h1>

                {tickets.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-8 text-center">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
                            <svg className="w-full h-full text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Vous n'avez pas encore de billets</h2>
                        <p className="text-gray-600 mb-6 sm:mb-8">Explorez nos événements pour trouver et réserver vos prochains spectacles.</p>
                        <button className="inline-flex items-center bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-sm sm:text-base">
                            Découvrir les événements
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all ${
                                    activeTicket === ticket.id ? 'ring-2 ring-blue-500' : ''
                                }`}
                            >
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-center mb-2 gap-2">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                        ticket.status === 'valid'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {ticket.status === 'valid' ? 'Valide' : 'Utilisé'}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Billet #{ticket.id}
                                                </span>
                                            </div>
                                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{ticket.eventName}</h2>
                                            <p className="text-blue-600 font-medium">{ticket.type}</p>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex flex-wrap items-start gap-2 w-full md:w-auto">
                                            <button
                                                onClick={() => handleShowQRCode(ticket.id)}
                                                className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                                                    activeTicket === ticket.id
                                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                } transition-colors flex-1 md:flex-none justify-center md:justify-start`}
                                            >
                                                <QrCode size={16} className="mr-2" />
                                                {activeTicket === ticket.id ? 'Masquer QR' : 'Afficher QR'}
                                            </button>
                                            <button
                                                onClick={() => handleDownloadTicket(ticket)}
                                                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex-1 md:flex-none justify-center md:justify-start"
                                            >
                                                <Download size={16} className="mr-2" />
                                                Télécharger
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        <div className="flex items-start">
                                            <Calendar size={18} className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-500">Date</p>
                                                <p className="text-sm font-medium truncate">{formatDate(ticket.date)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <Clock size={18} className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-500">Horaires</p>
                                                <p className="text-sm font-medium truncate">{ticket.time}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <MapPin size={18} className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-500">Lieu</p>
                                                <p className="text-sm font-medium truncate">{ticket.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {activeTicket === ticket.id && (
                                        <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg flex flex-col items-center">
                                            <div className="mb-2 text-center">
                                                <p className="text-sm font-medium text-gray-700">Code QR du billet</p>
                                                <p className="text-xs text-gray-500 mb-2">À présenter à l'entrée de l'événement</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                                <img
                                                    src={ticket.qrCode}
                                                    alt={`QR Code du billet ${ticket.id}`}
                                                    className="w-36 h-36 sm:w-48 sm:h-48"
                                                />
                                            </div>
                                            <div className="mt-2 text-center">
                                                <p className="text-xs font-medium">{ticket.id}</p>
                                                <p className="text-xs text-gray-500">Acheté le {formatDate(ticket.purchaseDate)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TicketsSection;