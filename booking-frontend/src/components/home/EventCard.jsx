import React from 'react';

const EventCard = ({ evenement, navigate }) => {
    const formatDates = (debut, fin) => {
        const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const dateDebut = new Date(debut).toLocaleDateString('fr-FR', dateOptions);
        const dateFin = new Date(fin).toLocaleDateString('fr-FR', dateOptions);

        return debut === fin ? dateDebut : `Du ${dateDebut} au ${dateFin}`;
    };

    return (
        <div className="relative flex flex-col sm:flex-row rounded-xl bg-white bg-clip-border text-gray-700 shadow-md overflow-hidden mb-8">
            <div
                className="relative m-0 sm:w-2/5 shrink-0 overflow-hidden rounded-xl sm:rounded-r-none bg-white bg-clip-border text-gray-700 cursor-pointer"
                onClick={() => navigate(`/evenement/${evenement.id}`)}
            >
                <img
                    src={evenement.image}
                    alt={evenement.nom}
                    className="h-64 sm:h-full w-full object-cover"
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-2">
                    <h4 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased cursor-pointer hover:text-blue-500"
                        onClick={() => navigate(`/evenement/${evenement.id}`)}
                    >
                        {evenement.nom}
                    </h4>
                    <h6 className="mb-2 block font-sans text-base font-semibold uppercase leading-relaxed text-blue-500 antialiased">
                        {evenement.lieu}
                    </h6>
                    <p className="mb-2 block font-sans text-sm leading-relaxed text-gray-600 antialiased">
                        {formatDates(evenement.dateDebut, evenement.dateFin)}
                    </p>
                </div>
                <p className="mb-8 block font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
                    {evenement.description}
                </p>
                <div className="mt-auto">
                    <button
                        className="flex select-none items-center gap-2 rounded-lg py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-blue-500 transition-all hover:bg-blue-500/10 active:bg-blue-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                        onClick={() => navigate(`/evenement/${evenement.id}`)}
                    >
                        En savoir plus
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            aria-hidden="true"
                            className="h-4 w-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;