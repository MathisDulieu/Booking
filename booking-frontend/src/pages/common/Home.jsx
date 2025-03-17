import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../../components/home/EventCard.jsx';
import { Calendar, Music, Tent } from 'lucide-react';

function Home() {
    const carouselImages = [
        "https://www.ticketmaster.fr/statics/slider/no-rework/blackpink_g.webp",
        "https://www.ticketmaster.fr/statics/slider/no-rework/louane_g.webp",
        "https://www.ticketmaster.fr/statics/slider/no-rework/saint-patrick_g.webp",
        "https://static.vecteezy.com/ti/vecteur-libre/p1/2090194-banniere-de-festival-de-musique-d-ete-gratuit-vectoriel.jpg",
        "https://static.vecteezy.com/ti/vecteur-libre/p1/2090196-banniere-de-festival-de-musique-d-ete-gratuit-vectoriel.jpg"
    ];

    const evenements = [
        {
            id: 1,
            nom: "Festival de Jazz de Paris",
            lieu: "Parc de la Villette",
            dateDebut: "2025-04-15",
            dateFin: "2025-04-20",
            description: "Le plus grand festival de jazz d'Europe avec des artistes internationaux et des découvertes locales.",
            image: "https://www.ticketmaster.fr/statics/16-9/bon-plan-eddy-de-pretto_g.webp"
        },
        {
            id: 2,
            nom: "Concert Symphonique",
            lieu: "Philharmonie de Paris",
            dateDebut: "2025-05-05",
            dateFin: "2025-05-05",
            description: "Une soirée exceptionnelle avec l'Orchestre National de France interprétant les plus grands classiques.",
            image: "https://www.ticketmaster.fr/statics/16-9/bruce-springsteen-lille_g.webp"
        },
        {
            id: 3,
            nom: "Spectacle de Danse Contemporaine",
            lieu: "La Seine Musicale",
            dateDebut: "2025-05-12",
            dateFin: "2025-05-14",
            description: "Un voyage artistique à travers les plus belles chorégraphies contemporaines avec des danseurs de renommée internationale.",
            image: "https://www.ticketmaster.fr/statics/16-9/calogero_g.webp"
        },
        {
            id: 4,
            nom: "Festival Électro",
            lieu: "Docks de Paris",
            dateDebut: "2025-06-01",
            dateFin: "2025-06-03",
            description: "Trois jours de musique électronique non-stop avec les meilleurs DJs de la scène internationale.",
            image: "https://www.ticketmaster.fr/statics/16-9/gims_g.webp"
        },
        {
            id: 5,
            nom: "Exposition d'Art Moderne",
            lieu: "Palais de Tokyo",
            dateDebut: "2025-06-15",
            dateFin: "2025-08-30",
            description: "Une exposition exclusive des œuvres d'artistes contemporains les plus innovants de notre époque.",
            image: "https://www.ticketmaster.fr/statics/16-9/jarry_g.webp"
        },
        {
            id: 6,
            nom: "Concert de Rock",
            lieu: "Stade de France",
            dateDebut: "2025-07-10",
            dateFin: "2025-07-10",
            description: "Un concert exceptionnel avec les légendes du rock dans le cadre de leur tournée mondiale.",
            image: "/api/placeholder/800/500"
        },
        {
            id: 7,
            nom: "Festival de Théâtre",
            lieu: "Théâtre du Châtelet",
            dateDebut: "2025-07-20",
            dateFin: "2025-07-30",
            description: "Dix jours de représentations théâtrales avec les meilleures compagnies françaises et européennes.",
            image: "/api/placeholder/800/500"
        },
        {
            id: 8,
            nom: "Conférence Technologique",
            lieu: "Paris Expo Porte de Versailles",
            dateDebut: "2025-08-05",
            dateFin: "2025-08-07",
            description: "La plus grande conférence tech de France avec des intervenants de renommée mondiale.",
            image: "/api/placeholder/800/500"
        },
        {
            id: 9,
            nom: "Festival de Cinéma",
            lieu: "Cinémathèque Française",
            dateDebut: "2025-09-01",
            dateFin: "2025-09-14",
            description: "Découvrez les nouveaux talents du cinéma et revisitez les classiques lors de ce festival exceptionnel.",
            image: "/api/placeholder/800/500"
        },
        {
            id: 10,
            nom: "Concert de Musique Classique",
            lieu: "Opéra Garnier",
            dateDebut: "2025-09-20",
            dateFin: "2025-09-20",
            description: "Une soirée magique avec les plus grands interprètes de musique classique dans un cadre prestigieux.",
            image: "/api/placeholder/800/500"
        },
        {
            id: 11,
            nom: "Festival Gastronomique",
            lieu: "Jardin des Tuileries",
            dateDebut: "2025-10-01",
            dateFin: "2025-10-05",
            description: "Un événement culinaire avec les plus grands chefs français et internationaux.",
            image: "/api/placeholder/800/500"
        },
        {
            id: 12,
            nom: "Spectacle de Cirque Contemporain",
            lieu: "Parc de la Villette",
            dateDebut: "2025-10-15",
            dateFin: "2025-10-25",
            description: "Un spectacle innovant mêlant acrobaties, danse et arts visuels.",
            image: "/api/placeholder/800/500"
        }
    ];

    const [activeSlide, setActiveSlide] = useState(0);
    const evenementsParPage = 5;
    const [pageActuelle, setPageActuelle] = useState(1);
    const [activeFilter, setActiveFilter] = useState('Evenements');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

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

    const changerPage = (page) => {
        setPageActuelle(page);
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

    const filteredEvents = evenements;

    const evenementsAffiches = useMemo(() => {
        const startIdx = (pageActuelle - 1) * evenementsParPage;
        const endIdx = startIdx + evenementsParPage;
        return filteredEvents.slice(startIdx, endIdx);
    }, [filteredEvents, pageActuelle, evenementsParPage]);

    const totalPages = Math.ceil(filteredEvents.length / evenementsParPage);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto mb-12">
                <div id="evenements-carousel" className="relative" data-carousel="static">
                    <div className="overflow-hidden relative h-56 rounded-lg sm:h-64 md:h-80 lg:h-96">
                        {carouselImages.map((imageUrl, index) => (
                            <div
                                key={index}
                                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                onClick={() => navigate(`/evenement/${index + 1}`)}
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
                        <span className="hidden">Précédent</span>
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
                        <span className="hidden">Suivant</span>
                    </span>
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Événements à venir</h2>

                <div className="relative inline-block text-left" >
                    <button id="dropdown-button" className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500" onClick={toggleDropdown}>
                        {activeFilter}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div id="dropdown-menu" className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${isDropdownOpen ? '' : 'hidden'}`}>
                        <div className="py-2 p-2" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-button">
                            <a
                                className="flex block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer"
                                role="menuitem"
                                onClick={() => {
                                    setActiveFilter('Evenements');
                                    setPageActuelle(1);
                                    setIsDropdownOpen(false);
                                }}
                            >
                                <Calendar size={16} className="mr-2" /> Evenements
                            </a>
                            <a
                                className="flex block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer"
                                role="menuitem"
                                onClick={() => {
                                    setActiveFilter('Concerts');
                                    setPageActuelle(1);
                                    setIsDropdownOpen(false);
                                }}
                            >
                                <Music size={16} className="mr-2" /> Concerts
                            </a>
                            <a
                                className="flex block rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer"
                                role="menuitem"
                                onClick={() => {
                                    setActiveFilter('Festivals');
                                    setPageActuelle(1);
                                    setIsDropdownOpen(false);
                                }}
                            >
                                <Tent size={16} className="mr-2" /> Festivals
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                {evenementsAffiches.map((evenement) => (
                    <EventCard key={evenement.id} evenement={evenement} navigate={navigate} />
                ))}

                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 my-8">
                        <button
                            onClick={() => changerPage(Math.max(1, pageActuelle - 1))}
                            disabled={pageActuelle === 1}
                            className="px-4 py-2 border rounded-md text-blue-500 border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Précédent
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= pageActuelle - 1 && page <= pageActuelle + 1)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => changerPage(page)}
                                        className={`px-4 py-2 border rounded-md ${
                                            pageActuelle === page
                                                ? 'bg-blue-500 text-white'
                                                : 'text-blue-500 border-blue-500 hover:bg-blue-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (
                                (page === pageActuelle - 2 && pageActuelle > 3) ||
                                (page === pageActuelle + 2 && pageActuelle < totalPages - 2)
                            ) {
                                return <span key={page} className="px-2">...</span>;
                            }
                            return null;
                        })}

                        <button
                            onClick={() => changerPage(Math.min(totalPages, pageActuelle + 1))}
                            disabled={pageActuelle === totalPages}
                            className="px-4 py-2 border rounded-md text-blue-500 border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Suivant
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;