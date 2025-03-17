import React, { useState } from 'react';
import { Check, X, Eye, EyeOff, Phone, Pencil } from 'lucide-react';

function Account() {
    // Données utilisateur et états
    const userData = {
        email: "john.doe@company.com",
        emailValidated: true,
        phoneNumber: "+33 6 12 34 56 78",
        phoneValidated: false
    };

    // États
    const [showPassword, setShowPassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPhoneValidationModal, setShowPhoneValidationModal] = useState(false);
    const [validationCode, setValidationCode] = useState('');
    const [email, setEmail] = useState(userData.email);
    const [phoneNumber, setPhoneNumber] = useState(userData.phoneNumber);
    const [emailValidated, setEmailValidated] = useState(userData.emailValidated);
    const [phoneValidated, setPhoneValidated] = useState(userData.phoneValidated);
    const [showEditEmailModal, setShowEditEmailModal] = useState(false);
    const [showEditPhoneModal, setShowEditPhoneModal] = useState(false);
    const [newEmail, setNewEmail] = useState(userData.email);
    const [newPhoneNumber, setNewPhoneNumber] = useState(userData.phoneNumber);

    // Fonctions
    const togglePasswordVisibility = () => {
        setShowPasswordVisibility(!showPassword);
    };

    const handleSavePassword = () => {
        // Logique pour sauvegarder le mot de passe
        console.log("Mot de passe sauvegardé");
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteAccount = () => {
        console.log("Compte supprimé");
        setShowDeleteModal(false);
        // Logique de suppression de compte
    };

    const handleValidatePhone = () => {
        setShowPhoneValidationModal(true);
    };

    const submitPhoneValidation = () => {
        if (validationCode.length === 6) {
            setPhoneValidated(true);
            setShowPhoneValidationModal(false);
            console.log("Numéro de téléphone validé avec le code:", validationCode);
        }
    };

    const handleEditEmail = () => {
        setShowEditEmailModal(true);
    };

    const handleEditPhone = () => {
        setShowEditPhoneModal(true);
    };

    const saveEmail = () => {
        setEmail(newEmail);
        setEmailValidated(false); // Nouvelle adresse email à valider
        setShowEditEmailModal(false);
        console.log("Email mis à jour:", newEmail);
    };

    const savePhoneNumber = () => {
        setPhoneNumber(newPhoneNumber);
        setPhoneValidated(false); // Nouveau numéro à valider
        setShowEditPhoneModal(false);
        console.log("Numéro de téléphone mis à jour:", newPhoneNumber);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="border-b py-6 text-3xl font-bold">Paramètres</h1>
                <div className="grid grid-cols-8 pt-3 sm:grid-cols-10">
                    <div className="relative my-4 w-56 sm:hidden">
                        <input className="peer hidden" type="checkbox" name="select-1" id="select-1" />
                        <label htmlFor="select-1" className="flex w-full cursor-pointer select-none rounded-lg border p-2 px-3 text-sm text-gray-700 ring-blue-500 peer-checked:ring">Comptes </label>
                        <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute right-0 top-3 ml-auto mr-5 h-4 text-slate-700 transition peer-checked:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                        <ul className="max-h-0 select-none flex-col overflow-hidden rounded-b-lg shadow-md transition-all duration-300 peer-checked:max-h-56 peer-checked:py-3">
                            <li className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-500 hover:text-white">Comptes</li>
                            <li className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-500 hover:text-white">Équipe</li>
                            <li className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-500 hover:text-white">Autres</li>
                        </ul>
                    </div>

                    <div className="col-span-2 hidden sm:block">
                        <ul>
                            <li className="mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-500 hover:text-blue-500">Profil</li>
                            <li className="mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-500 hover:text-blue-500">Notifications</li>
                        </ul>
                    </div>

                    <div className="col-span-8 overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
                        <div className="pt-4">
                            <h1 className="py-2 text-2xl font-semibold">Paramètres du compte</h1>
                        </div>
                        <hr className="mt-4 mb-8" />

                        {/* Email section */}
                        <p className="py-2 text-xl font-semibold">Adresse email</p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center">
                                <p className="text-gray-600">Votre adresse email est <strong>{email}</strong></p>
                                <button
                                    className="ml-2 p-1 text-gray-500 hover:text-blue-500"
                                    onClick={handleEditEmail}
                                >
                                    <Pencil size={16} />
                                </button>
                                <div className={`ml-4 px-3 py-1 rounded-full ${emailValidated ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} flex items-center`}>
                                    {emailValidated ? (
                                        <>
                                            <Check size={16} className="mr-1" />
                                            <span>Validé</span>
                                        </>
                                    ) : (
                                        <>
                                            <X size={16} className="mr-1" />
                                            <span>Non Validé</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <hr className="mt-4 mb-8" />

                        {/* Phone section */}
                        <p className="py-2 text-xl font-semibold">Numéro de téléphone</p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    <Phone size={16} className="mr-2 text-gray-600" />
                                    <p className="text-gray-600">Votre numéro de téléphone est <strong>{phoneNumber}</strong></p>
                                    <button
                                        className="ml-2 p-1 text-gray-500 hover:text-blue-500"
                                        onClick={handleEditPhone}
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </div>
                                <div className={`ml-4 px-3 py-1 rounded-full ${phoneValidated ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} flex items-center`}>
                                    {phoneValidated ? (
                                        <>
                                            <Check size={16} className="mr-1" />
                                            <span>Validé</span>
                                        </>
                                    ) : (
                                        <>
                                            <X size={16} className="mr-1" />
                                            <span>Non Validé</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            {!phoneValidated && (
                                <button
                                    className="mt-2 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                    onClick={handleValidatePhone}
                                >
                                    Valider
                                </button>
                            )}
                        </div>
                        <hr className="mt-4 mb-8" />

                        {/* Password section */}
                        <p className="py-2 text-xl font-semibold">Mot de passe</p>
                        <div className="flex items-center">
                            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-3">
                                <label htmlFor="current-password">
                                    <span className="text-sm text-gray-500">Mot de passe actuel</span>
                                    <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-500">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="current-password"
                                            className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                            placeholder="***********"
                                        />
                                    </div>
                                </label>
                                <label htmlFor="new-password">
                                    <span className="text-sm text-gray-500">Nouveau mot de passe</span>
                                    <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-500">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="new-password"
                                            className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                            placeholder="***********"
                                        />
                                    </div>
                                </label>
                            </div>
                            <button
                                onClick={togglePasswordVisibility}
                                className="mt-5 ml-2 cursor-pointer"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-6 w-6 text-gray-600" />
                                ) : (
                                    <Eye className="h-6 w-6 text-gray-600" />
                                )}
                            </button>
                        </div>
                        <button
                            className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition"
                            onClick={handleSavePassword}
                        >
                            Enregistrer le mot de passe
                        </button>
                        <hr className="mt-4 mb-8" />

                        {/* Delete Account section */}
                        <div className="mb-10">
                            <p className="py-2 text-xl font-semibold">Supprimer le compte</p>
                            <p className="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-rose-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Procéder avec prudence
                            </p>
                            <p className="mt-2 mb-4">Assurez-vous d'avoir sauvegardé vos données de compte au cas où vous auriez besoin d'y accéder ultérieurement. Nous supprimerons complètement vos données. Il n'y aura aucun moyen d'accéder à votre compte après cette action.</p>
                            <button
                                className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition"
                                onClick={handleDeleteAccount}
                            >
                                Supprimer définitivement
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de suppression de compte */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
                        <p className="mb-6">Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Annuler
                            </button>
                            <button
                                className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition"
                                onClick={confirmDeleteAccount}
                            >
                                Supprimer définitivement
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de validation du numéro de téléphone */}
            {showPhoneValidationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Validation du numéro de téléphone</h2>
                        <p className="mb-4">Un message contenant un code à 6 chiffres a été envoyé à votre numéro de téléphone. Veuillez saisir ce code pour valider votre numéro.</p>
                        <div className="mb-4">
                            <label htmlFor="validation-code" className="block text-sm font-medium text-gray-700 mb-1">Code de validation</label>
                            <input
                                type="text"
                                id="validation-code"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="123456"
                                value={validationCode}
                                onChange={(e) => setValidationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                maxLength={6}
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                                onClick={() => setShowPhoneValidationModal(false)}
                            >
                                Annuler
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                onClick={submitPhoneValidation}
                                disabled={validationCode.length !== 6}
                            >
                                Valider
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal d'édition d'email */}
            {showEditEmailModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Modifier l'adresse email</h2>
                        <div className="mb-4">
                            <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 mb-1">Nouvelle adresse email</label>
                            <input
                                type="email"
                                id="new-email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                                onClick={() => setShowEditEmailModal(false)}
                            >
                                Annuler
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                onClick={saveEmail}
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal d'édition du numéro de téléphone */}
            {showEditPhoneModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Modifier le numéro de téléphone</h2>
                        <div className="mb-4">
                            <label htmlFor="new-phone" className="block text-sm font-medium text-gray-700 mb-1">Nouveau numéro de téléphone</label>
                            <input
                                type="tel"
                                id="new-phone"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newPhoneNumber}
                                onChange={(e) => setNewPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                                onClick={() => setShowEditPhoneModal(false)}
                            >
                                Annuler
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                onClick={savePhoneNumber}
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Account;