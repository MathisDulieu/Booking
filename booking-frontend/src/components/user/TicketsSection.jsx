import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Download, QrCode, Loader2, CheckCircle } from 'lucide-react';
import { GetCurrentUserTicketsRequest } from '../../hooks/TicketHooks';
import Cookies from 'js-cookie';

function TicketsSection() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [activeTicket, setActiveTicket] = useState(null);

    const showNotification = (type, message) => {
        setError(message);
        setStatus(type);

        if (type === 'success') {
            setTimeout(() => {
                if (status === 'success') {
                    setStatus('idle');
                }
            }, 5000);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        setError('');
        try {
            const authToken = Cookies.get('authToken');

            if (!authToken) {
                showNotification('error', 'Authentication required. Please login again.');
                setLoading(false);
                return;
            }

            const response = await GetCurrentUserTicketsRequest();

            if (response.warning) {
                setTickets([]);
            } else if (response.message && response.message.tickets) {
                const mappedTickets = response.message.tickets.map(ticket => ({
                    id: ticket.id,
                    eventId: ticket.eventId,
                    eventName: ticket.eventName || "Event",
                    location: ticket.location || "Venue",
                    date: ticket.eventDate || new Date().toISOString().split('T')[0],
                    time: ticket.eventTime || "TBA",
                    type: ticket.ticketType,
                    price: ticket.price,
                    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.id}`,
                    status: ticket.status === "ACTIVE" ? "valid" :
                        ticket.status === "USED" ? "used" :
                            ticket.status === "CANCELLED" ? "cancelled" : "expired",
                    purchaseDate: ticket.purchaseDate
                }));

                setTickets(mappedTickets);
            }
        } catch (error) {
            let errorMessage = "Failed to load tickets.";

            if (error.message.includes('401')) {
                errorMessage = "Authentication required. Please login again.";
            } else if (error.message.includes('500')) {
                errorMessage = "The service is currently unavailable. Please try again later.";
            }

            showNotification('error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Updated format date function to ensure full date display
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return "Invalid date";
            }

            // Using a more specific format to ensure the full date is displayed
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC' // Use UTC to avoid timezone issues
            };

            return date.toLocaleDateString('en-US', options);
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString; // Return the original string if there's an error
        }
    };

    const handleShowQRCode = (ticketId) => {
        setActiveTicket(ticketId === activeTicket ? null : ticketId);
    };

    const handleDownloadTicket = (ticket) => {
        console.log('Downloading ticket:', ticket.id);
        // Here you would implement the logic to generate/download a PDF
        alert(`The ticket for "${ticket.eventName}" will be downloaded.`);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 sm:py-16 flex justify-center items-center">
                <Loader2 className="animate-spin h-12 w-12 sm:h-16 sm:w-16 text-blue-500" />
                <p className="ml-4 text-lg text-gray-600">Loading tickets...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">My Tickets</h1>

                {status === 'success' && (
                    <div className="flex items-center p-3 text-sm text-green-600 bg-green-50 rounded-md mb-4">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center w-full mb-4">
                        <p className="text-lg font-semibold text-red-800 mb-2">Error</p>
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <div className="mb-4 flex justify-end">
                    <button
                        onClick={fetchTickets}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <RefreshCw size={16} className="mr-2" />
                        Refresh Tickets
                    </button>
                </div>

                {tickets.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-8 text-center">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6">
                            <svg className="w-full h-full text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">You don't have any tickets yet</h2>
                        <p className="text-gray-600 mb-6 sm:mb-8">Explore our events to find and book your next shows.</p>
                        <button className="inline-flex items-center bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-sm sm:text-base">
                            Discover Events
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
                                                            : ticket.status === 'used'
                                                                ? 'bg-gray-100 text-gray-800'
                                                                : ticket.status === 'cancelled'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {ticket.status === 'valid' ? 'Valid' :
                                                        ticket.status === 'used' ? 'Used' :
                                                            ticket.status === 'cancelled' ? 'Cancelled' : 'Expired'}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    Ticket #{ticket.id}
                                                </span>
                                            </div>
                                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{ticket.eventName}</h2>
                                            <p className="text-blue-600 font-medium">{ticket.type}</p>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex flex-row items-center space-x-2 w-full md:w-auto">
                                            <button
                                                onClick={() => handleShowQRCode(ticket.id)}
                                                className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                                                    activeTicket === ticket.id
                                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                } transition-colors justify-center md:justify-start`}
                                            >
                                                <QrCode size={16} className="mr-2" />
                                                {activeTicket === ticket.id ? 'Hide' : 'Show'}
                                            </button>
                                            <button
                                                onClick={() => handleDownloadTicket(ticket)}
                                                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm justify-center md:justify-start"
                                            >
                                                <Download size={16} className="mr-2" />
                                                Download
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-between w-full">
                                        <div className="flex items-start">
                                            <Calendar size={18} className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-500">Date</p>
                                                <p className="text-sm font-medium">{formatDate(ticket.date)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <MapPin size={18} className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-500">Location</p>
                                                <p className="text-sm font-medium">{ticket.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {activeTicket === ticket.id && (
                                        <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg flex flex-col items-center">
                                            <div className="mb-2 text-center">
                                                <p className="text-sm font-medium text-gray-700">Ticket QR Code</p>
                                                <p className="text-xs text-gray-500 mb-2">Present this at the event entrance</p>
                                                {ticket.status !== 'valid' && (
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                        ticket.status === 'used' ? 'bg-gray-100 text-gray-800' :
                                                            ticket.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        This ticket is {ticket.status}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                                <img
                                                    src={ticket.qrCode}
                                                    alt={`QR Code for ticket ${ticket.id}`}
                                                    className="w-36 h-36 sm:w-48 sm:h-48"
                                                />
                                            </div>
                                            <div className="mt-2 text-center">
                                                <p className="text-xs font-medium">{ticket.id}</p>
                                                <p className="text-xs text-gray-500">Purchased on {formatDate(ticket.purchaseDate)}</p>
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

function RefreshCw({ size, className }) {
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
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
        </svg>
    );
}

export default TicketsSection;