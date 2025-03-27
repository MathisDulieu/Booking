import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EventCard from '../../components/home/EventCard.jsx';
import { Calendar, Music, Tent, AlertCircle, Loader2, Search, X } from 'lucide-react';
import { GetAllEventsRequests } from '../../hooks/EventHooks';

function Home() {
    const carouselImages = [
        "https://i.ibb.co/W4tB1v3S/festival1.jpg",
        "https://i.ibb.co/Cpg2mSQv/festival2.jpg",
        "https://i.ibb.co/ks7tMfp1/festival3.jpg",
        "https://i.ibb.co/cSQRvKrg/festival4.jpg",
        "https://i.ibb.co/Y6Z7LwH/festival5.jpg"
    ];

    const [activeSlide, setActiveSlide] = useState(0);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('idle');
    const eventsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEvents, setTotalEvents] = useState(0);
    const [activeFilter, setActiveFilter] = useState('EVENT');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const filterParam = params.get('filter');
        const searchParam = params.get('search');

        if (filterParam) {
            setActiveFilter(filterParam);
        }

        if (searchParam) {
            setSearchKeyword(searchParam);
        } else {
            setSearchKeyword('');
        }

        setCurrentPage(0);
    }, [location.search]);

    const showNotification = (type, message) => {
        setError(message);
        setStatus(type);

        if (type === 'success') {
            setTimeout(() => {
                setStatus(currentStatus =>
                    currentStatus === 'success' ? 'idle' : currentStatus
                );
            }, 5000);
        }
    };

    const loadEvents = async () => {
        setIsLoading(true);
        setError('');
        setStatus('idle');

        try {
            const eventFilterData = {};

            if (activeFilter !== 'EVENT') {
                eventFilterData.filter = activeFilter;
            } else {
                eventFilterData.filter = 'EVENT';
            }

            if (searchKeyword) {
                eventFilterData.filterSearch = searchKeyword;
            }

            const response = await GetAllEventsRequests(
                eventFilterData,
                currentPage,
                eventsPerPage
            );

            if (response.warning) {
                setEvents([]);
                setTotalPages(response.warning.totalPages || 0);
                setTotalEvents(response.warning.eventsFound || 0);
                showNotification('warning', response.warning.error || 'No events found');
            } else if (response.events) {
                setEvents(response.events.events || []);
                setTotalPages(response.events.totalPages || 1);
                setTotalEvents(response.events.eventsFound || 0);
                setStatus('idle');
            } else if (response.BAD_REQUEST) {
                showNotification('error', response.BAD_REQUEST.error || 'Invalid request');
                setEvents([]);
            } else {
                setEvents([]);
                showNotification('error', 'Unknown response format');
            }
        } catch (err) {
            console.error('Error loading events:', err);
            let errorMessage = "An error occurred while loading events";

            if (err.message) {
                if (err.message.includes('401')) {
                    errorMessage = "Authentication required. Please log in again.";
                } else if (err.message.includes('400')) {
                    errorMessage = "Invalid request.";
                } else if (err.message.includes('500')) {
                    errorMessage = "The service is temporarily unavailable.";
                }
            }

            showNotification('error', errorMessage);
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, [activeFilter, currentPage, searchKeyword]);

    const nextSlide = () => {
        setActiveSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
    };

    const prevSlide = () => {
        setActiveSlide((prevSlide) => (prevSlide - 1 + carouselImages.length) % carouselImages.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const changePage = (page) => {
        setCurrentPage(page - 1);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdownButton = document.getElementById('dropdown-button');
            const dropdownMenu = document.getElementById('dropdown-menu');

            if (dropdownButton && dropdownMenu &&
                !dropdownButton.contains(event.target) &&
                !dropdownMenu.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setCurrentPage(0);
        setIsDropdownOpen(false);

        const params = new URLSearchParams(location.search);
        params.set('filter', filter);
        navigate(`/?${params.toString()}`);
    };

    const clearSearch = () => {
        navigate('/');
    };

    const getFilterDisplayText = (filter) => {
        switch (filter) {
            case 'CONCERT': return 'CONCERT';
            case 'FESTIVAL': return 'FESTIVAL';
            case 'EVENT': return 'All Events';
            case 'ARTIST': return 'ARTIST';
            case 'PLACE': return 'PLACE';
            default: return 'EVENT';
        }
    };

    const formattedEvents = useMemo(() => {
        return events.map(event => {
            const formatArrayToDate = (dateArray) => {
                if (!dateArray || dateArray.length < 3) return "";

                const [year, month, day] = dateArray;
                return new Date(year, month - 1, day).toISOString().split('T')[0];
            };

            return {
                id: event.id,
                nom: event.name,
                lieu: event.address || "To be determined",
                dateDebut: formatArrayToDate(event.startTime),
                dateFin: formatArrayToDate(event.endTime),
                description: event.description || "",
                image: event.imageUrl || "/api/placeholder/800/500",
                type: event.eventType,
                price: event.minimumPrice
            };
        });
    }, [events]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto mb-12">
                <div id="events-carousel" className="relative" data-carousel="static">
                    <div className="overflow-hidden relative h-56 rounded-lg sm:h-64 md:h-80 lg:h-96">
                        {carouselImages.map((imageUrl, index) => (
                            <div
                                key={index}
                                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                onClick={() => navigate(`/event/${index + 1}`)}
                            >
                                <img
                                    src={imageUrl}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex absolute bottom-5 left-1/2 z-30 space-x-3 -translate-x-1/2">
                        {carouselImages.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`w-3 h-3 rounded-full ${index === activeSlide ? 'bg-white' : 'bg-white/50'}`}
                                aria-label={`Slide ${index + 1}`}
                                onClick={() => setActiveSlide(index)}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        className="flex absolute top-0 left-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
                        onClick={prevSlide}
                    >
                    <span className="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                        <svg className="w-5 h-5 text-white sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        <span className="hidden">Previous</span>
                    </span>
                    </button>
                    <button
                        type="button"
                        className="flex absolute top-0 right-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
                        onClick={nextSlide}
                    >
                    <span className="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                        <svg className="w-5 h-5 text-white sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                        <span className="hidden">Next</span>
                    </span>
                    </button>
                </div>
            </div>

            {searchKeyword && (
                <div className="max-w-4xl mx-auto mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <Search size={18} className="text-blue-600 mr-2" />
                            <span className="text-blue-800">
                                Search results for: <span className="font-semibold">"{searchKeyword}"</span>
                                {activeFilter !== 'EVENT' && (
                                    <span> in <span className="font-semibold">{getFilterDisplayText(activeFilter)}</span></span>
                                )}
                            </span>
                        </div>
                        <button
                            onClick={clearSearch}
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        >
                            <X size={16} className="mr-1" />
                            Clear
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Upcoming Events</h2>

                <div className="relative inline-block text-left" >
                    <button id="dropdown-button" className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500" onClick={toggleDropdown}>
                        {getFilterDisplayText(activeFilter)}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div id="dropdown-menu" className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${isDropdownOpen ? '' : 'hidden'}`}>
                        <div className="py-2 p-2" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-button">
                            <a
                                className="flex block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer"
                                role="menuitem"
                                onClick={() => handleFilterChange('EVENT')}
                            >
                                <Calendar size={16} className="mr-2" /> All Events
                            </a>
                            <a
                                className="flex block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer"
                                role="menuitem"
                                onClick={() => handleFilterChange('CONCERT')}
                            >
                                <Music size={16} className="mr-2" /> Concerts
                            </a>
                            <a
                                className="flex block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer"
                                role="menuitem"
                                onClick={() => handleFilterChange('FESTIVAL')}
                            >
                                <Tent size={16} className="mr-2" /> Festivals
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                {status === 'success' && (
                    <div className="flex items-center p-4 text-sm text-green-600 bg-green-50 rounded-lg mb-6">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                {status === 'warning' && (
                    <div className="flex items-center p-4 text-sm text-yellow-600 bg-yellow-50 rounded-lg mb-6">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex items-center p-4 text-sm text-red-600 bg-red-50 rounded-lg mb-6">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mr-2" />
                        <span className="text-gray-600">Loading events...</span>
                    </div>
                ) : formattedEvents.length > 0 ? (
                    <>
                        {formattedEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                evenement={event}
                                navigate={navigate}
                            />
                        ))}
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-gray-500 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
                        <p className="text-gray-500">
                            {searchKeyword
                                ? `No events found for "${searchKeyword}" ${activeFilter !== 'EVENT' ? `in category ${getFilterDisplayText(activeFilter)}` : ''}`
                                : 'No events match your search criteria.'}
                        </p>
                        {searchKeyword && (
                            <button
                                onClick={clearSearch}
                                className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                            >
                                <X size={16} className="mr-1" />
                                Clear search
                            </button>
                        )}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 my-8">
                        <button
                            onClick={() => changePage(Math.max(1, currentPage))}
                            disabled={currentPage === 0}
                            className="px-4 py-2 border rounded-md text-blue-500 border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage + 1 && page <= currentPage + 3)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => changePage(page)}
                                        className={`px-4 py-2 border rounded-md ${
                                            currentPage + 1 === page
                                                ? 'bg-blue-500 text-white'
                                                : 'text-blue-500 border-blue-500 hover:bg-blue-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (
                                (page === currentPage - 1 && currentPage > 2) ||
                                (page === currentPage + 4 && currentPage < totalPages - 3)
                            ) {
                                return <span key={page} className="px-2">...</span>;
                            }
                            return null;
                        })}

                        <button
                            onClick={() => changePage(Math.min(totalPages, currentPage + 2))}
                            disabled={currentPage + 1 >= totalPages}
                            className="px-4 py-2 border rounded-md text-blue-500 border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function CheckCircle({ className, size }) {
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}

export default Home;