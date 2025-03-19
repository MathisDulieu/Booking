import React, {useEffect, useState} from 'react';
import { Check, X, Eye, EyeOff, Mail, Phone, Pencil, LogOut } from 'lucide-react';
import NotificationsSection from '../../components/user/NotificationsSection.jsx';
import TicketsSection from '../../components/user/TicketsSection.jsx';

function Account() {
    const [activeTab, setActiveTab] = useState('profile');
    const userData = {
        email: "john.doe@company.com",
        emailValidated: true,
        phoneNumber: "+33 6 12 34 56 78",
        phoneValidated: false,
        username: "johndoe"
    };

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPhoneValidationModal, setShowPhoneValidationModal] = useState(false);
    const [validationCode, setValidationCode] = useState('');
    const [email, setEmail] = useState(userData.email);
    const [phoneNumber, setPhoneNumber] = useState(userData.phoneNumber);
    const [username, setUsername] = useState(userData.username);
    const [emailValidated, setEmailValidated] = useState(userData.emailValidated);
    const [phoneValidated, setPhoneValidated] = useState(userData.phoneValidated);
    const [showEditEmailModal, setShowEditEmailModal] = useState(false);
    const [showEditPhoneModal, setShowEditPhoneModal] = useState(false);
    const [showEditUsernameModal, setShowEditUsernameModal] = useState(false);
    const [codeEnvoye, setCodeEnvoye] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [newEmail, setNewEmail] = useState(userData.email);
    const [newPhoneNumber, setNewPhoneNumber] = useState(userData.phoneNumber);
    const [newUsername, setNewUsername] = useState(userData.username);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        hasLowerCase: false,
        hasUpperCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        hasMinLength: false
    });

    const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}';:",.<>?|`~])[A-Za-z\d!@#$%^&*()_+\-={}';:",.<>?|`~]{8,}$/;
    const USERNAME_REGEX = /^[^\s]{3,15}$/;
    const PHONE_REGEX = /^(\+33|0)[1-9][0-9]{8}$/;

    const validateEmail = (value) => {
        return EMAIL_REGEX.test(value);
    };

    const validatePhone = (value) => {
        // Retirer tous les espaces du numéro
        const rawPhone = value.replace(/\s/g, '');

        // Vérifier directement avec le regex
        if (PHONE_REGEX.test(rawPhone)) {
            return true;
        }

        // Si le numéro ne commence ni par +33 ni par 0, essayons de le valider avec +33 ajouté
        if (/^[1-9][0-9]{8}$/.test(rawPhone)) {
            return true; // C'est valide car on pourra ajouter le +33 devant
        }

        return false;
    };

    const handleLogout = () => {
        setShowLogoutModal(false);
    };

    const envoyerCodeSMS = () => {
        // Simulation de l'envoi du SMS
        console.log("Envoi d'un SMS au numéro", phoneNumber);

        // Dans un cas réel, vous feriez un appel API ici

        // Marquer comme envoyé
        setCodeEnvoye(true);

        // Générer un code pour la démo (en production, ce serait fait côté serveur)
        const codeGenere = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("Code généré:", codeGenere);

        // Optionnel: Vous pourriez afficher une notification de succès
    };

    const validateUsername = (value) => {
        return USERNAME_REGEX.test(value);
    };

    const validatePassword = (value) => {
        const hasLowerCase = /[a-z]/.test(value);
        const hasUpperCase = /[A-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*()_+\-={}';:",.<>?|`~]/.test(value);
        const hasMinLength = value.length >= 8;

        const criteriaCount = [hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar, hasMinLength].filter(Boolean).length;
        const score = Math.min(100, criteriaCount * 20);

        return {
            isValid: PASSWORD_REGEX.test(value),
            strength: {
                score,
                hasLowerCase,
                hasUpperCase,
                hasNumber,
                hasSpecialChar,
                hasMinLength
            }
        };
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength.score < 40) return 'bg-red-500';
        if (passwordStrength.score < 60) return 'bg-yellow-500';
        if (passwordStrength.score < 80) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const handleSavePassword = () => {
        const result = validatePassword(newPassword);
        if (result.isValid) {
            console.log("Mot de passe sauvegardé");
            setCurrentPassword('');
            setNewPassword('');
            setPasswordStrength({
                score: 0,
                hasLowerCase: false,
                hasUpperCase: false,
                hasNumber: false,
                hasSpecialChar: false,
                hasMinLength: false
            });
        } else {
            console.log("Le mot de passe ne répond pas aux critères de sécurité");
        }
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteAccount = () => {
        console.log("Compte supprimé");
        setShowDeleteModal(false);
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

    const handleEditUsername = () => {
        setShowEditUsernameModal(true);
    };

    const saveEmail = () => {
        if (validateEmail(newEmail)) {
            setEmail(newEmail);
            setEmailValidated(false);
            setShowEditEmailModal(false);
            console.log("Email mis à jour:", newEmail);
        } else {
            console.log("L'email n'est pas valide");
        }
    };

    const savePhoneNumber = () => {
        const rawInput = newPhoneNumber.replace(/\s/g, '');
        let formattedPhone = rawInput;

        // Formatage du numéro selon son format d'entrée
        if (rawInput.startsWith('+33')) {
            // Déjà au format international
            formattedPhone = rawInput;
        } else if (rawInput.startsWith('0')) {
            // Convertir format national en international
            formattedPhone = '+33' + rawInput.substring(1);
        } else if (/^[1-9][0-9]{8}$/.test(rawInput)) {
            // Numéro sans indicatif ni 0, ajouter +33
            formattedPhone = '+33' + rawInput;
        }

        // Formater pour l'affichage avec espaces
        const displayPhone = formattedPhone.replace(/^\+33(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/, '+33 $1 $2 $3 $4 $5');

        setPhoneNumber(displayPhone);
        setPhoneValidated(false);
        setShowEditPhoneModal(false);
        console.log("Numéro de téléphone mis à jour:", displayPhone);
    };

    const saveUsername = () => {
        if (validateUsername(newUsername)) {
            setUsername(newUsername);
            setShowEditUsernameModal(false);
            console.log("Nom d'utilisateur mis à jour:", newUsername);
        } else {
            console.log("Le nom d'utilisateur n'est pas valide");
        }
    };

    useEffect(() => {
        if (newPassword) {
            const result = validatePassword(newPassword);
            setPasswordStrength(result.strength);
        }
    }, [newPassword]);

    const renderProfileSection = () => {
        return (
            <>
                <div className="pt-4 flex justify-between items-center">
                    <h1 className="py-2 text-2xl font-semibold">Paramètres du compte</h1>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition flex items-center"
                    >
                        <LogOut size={18} className="mr-1" />
                        Déconnexion
                    </button>
                </div>
                <hr className="mt-4 mb-8" />

                <div className="flex items-center justify-between mb-2">
                    <p className="py-2 text-xl font-semibold">Nom d'utilisateur</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <p className="text-gray-600">Votre nom d'utilisateur est <strong>{username}</strong></p>
                            <button
                                className="ml-2 p-1 text-gray-500 hover:text-blue-500"
                                onClick={handleEditUsername}
                            >
                                <Pencil size={16} />
                            </button>
                        </div>
                    </div>
                </div>
                <hr className="mt-4 mb-8" />

                <div className="flex items-center justify-between mb-2">
                    <p className="py-2 text-xl font-semibold">Adresse email</p>
                    <div className={`px-3 py-1 rounded-full ${emailValidated ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} flex items-center`}>
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <Mail size={16} className="mr-2 text-gray-600" />
                            <p className="text-gray-600">Votre adresse email est <strong>{email}</strong></p>
                            <button
                                className="ml-2 p-1 text-gray-500 hover:text-blue-500"
                                onClick={handleEditEmail}
                            >
                                <Pencil size={16} />
                            </button>
                        </div>
                    </div>
                    {!emailValidated && (
                        <button
                            className="mt-2 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                            Valider l'email
                        </button>
                    )}
                </div>
                <hr className="mt-4 mb-8" />

                <div className="flex items-center justify-between mb-2">
                    <p className="py-2 text-xl font-semibold">Numéro de téléphone</p>
                    <div className={`px-3 py-1 rounded-full ${phoneValidated ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} flex items-center`}>
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

                <p className="py-2 text-xl font-semibold">Mot de passe</p>
                <div className="flex items-center flex-wrap">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                        <label className="w-full sm:w-auto">
                            <span className="text-sm text-gray-500">Mot de passe actuel</span>
                            <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-500">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    id="current-password"
                                    className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                    placeholder="***********"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </label>
                        <label className="w-full sm:w-auto">
                            <span className="text-sm text-gray-500">Nouveau mot de passe</span>
                            <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-500">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="new-password"
                                    className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                    placeholder="***********"
                                    value={newPassword}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setNewPassword(value);
                                    }}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </label>
                    </div>
                </div>

                {newPassword && (
                    <div className="mt-2">
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${getPasswordStrengthColor()}`}
                                style={{ width: `${passwordStrength.score}%` }}
                            ></div>
                        </div>
                        <div className="mt-2 text-sm">
                            <ul className="space-y-1">
                                <li className={`flex items-center ${passwordStrength.hasMinLength ? 'text-green-500' : 'text-slate-500'}`}>
                                    {passwordStrength.hasMinLength ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                                    Au moins 8 caractères
                                </li>
                                <li className={`flex items-center ${passwordStrength.hasLowerCase ? 'text-green-500' : 'text-slate-500'}`}>
                                    {passwordStrength.hasLowerCase ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                                    Au moins une lettre minuscule
                                </li>
                                <li className={`flex items-center ${passwordStrength.hasUpperCase ? 'text-green-500' : 'text-slate-500'}`}>
                                    {passwordStrength.hasUpperCase ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                                    Au moins une lettre majuscule
                                </li>
                                <li className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-500' : 'text-slate-500'}`}>
                                    {passwordStrength.hasNumber ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                                    Au moins un chiffre
                                </li>
                                <li className={`flex items-center ${passwordStrength.hasSpecialChar ? 'text-green-500' : 'text-slate-500'}`}>
                                    {passwordStrength.hasSpecialChar ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                                    Au moins un caractère spécial (!@#$%^&*...)
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                <button
                    className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition"
                    onClick={handleSavePassword}
                    disabled={!validatePassword(newPassword) || !currentPassword}
                >
                    Enregistrer le mot de passe
                </button>
                <hr className="mt-4 mb-8" />

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
            </>
        )
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="border-b py-6 text-3xl font-bold">Informations</h1>
                <div className="grid grid-cols-8 pt-3 sm:grid-cols-10">
                    <div className="relative my-4 w-56 sm:hidden">
                        <input className="peer hidden" type="checkbox" name="select-1" id="select-1" />
                        <label htmlFor="select-1" className="flex w-full cursor-pointer select-none rounded-lg border p-2 px-3 text-sm text-gray-700 ring-blue-500 peer-checked:ring">
                            {activeTab === 'profile' ? 'Profil' : activeTab === 'notifications' ? 'Notifications' : 'Tickets'}
                        </label>
                        <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute right-0 top-3 ml-auto mr-5 h-4 text-slate-700 transition peer-checked:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                        <ul className="max-h-0 select-none flex-col overflow-hidden rounded-b-lg shadow-md transition-all duration-300 peer-checked:max-h-56 peer-checked:py-3">
                            <li
                                className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-500 hover:text-white"
                                onClick={() => setActiveTab('profile')}
                            >
                                Profil
                            </li>
                            <li
                                className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-500 hover:text-white"
                                onClick={() => setActiveTab('notifications')}
                            >
                                Notifications
                            </li>
                            <li
                                className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-500 hover:text-white"
                                onClick={() => setActiveTab('tickets')}
                            >
                                Tickets
                            </li>
                        </ul>
                    </div>

                    {/* Menu desktop */}
                    <div className="col-span-2 hidden sm:block">
                        <ul>
                            <li
                                className={`mt-5 cursor-pointer border-l-2 ${activeTab === 'profile' ? 'border-l-blue-500 text-blue-500' : 'border-transparent'} px-2 py-2 font-semibold transition hover:border-l-blue-500 hover:text-blue-500`}
                                onClick={() => setActiveTab('profile')}
                            >
                                Profil
                            </li>
                            <li
                                className={`mt-5 cursor-pointer border-l-2 ${activeTab === 'notifications' ? 'border-l-blue-500 text-blue-500' : 'border-transparent'} px-2 py-2 font-semibold transition hover:border-l-blue-500 hover:text-blue-500`}
                                onClick={() => setActiveTab('notifications')}
                            >
                                Notifications
                            </li>
                            <li
                                className={`mt-5 cursor-pointer border-l-2 ${activeTab === 'tickets' ? 'border-l-blue-500 text-blue-500' : 'border-transparent'} px-2 py-2 font-semibold transition hover:border-l-blue-500 hover:text-blue-500`}
                                onClick={() => setActiveTab('tickets')}
                            >
                                Tickets
                            </li>
                        </ul>
                    </div>

                    {/* Content */}
                    <div className="col-span-8 overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
                        {activeTab === 'profile' ? (
                            renderProfileSection()
                        ) : activeTab === 'notifications' ? (
                            <NotificationsSection />
                        ) : (
                            <TicketsSection />
                        )}
                    </div>
                </div>

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

                {showPhoneValidationModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Validation du numéro de téléphone</h2>

                            {/* Ajout d'un état pour gérer l'envoi du SMS */}
                            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-blue-700 mb-2 sm:mb-0">
                                    {codeEnvoye ?
                                        "Un SMS avec un code à 6 chiffres a été envoyé à votre téléphone." :
                                        "Cliquez sur le bouton pour recevoir un code de validation par SMS."}
                                </p>
                                <button
                                    className={`px-3 py-1.5 text-sm rounded-md transition ${
                                        codeEnvoye ?
                                            "bg-gray-300 text-gray-600 cursor-not-allowed" :
                                            "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                                    onClick={envoyerCodeSMS}
                                    disabled={codeEnvoye}
                                >
                                    {codeEnvoye ? "Code envoyé" : "Envoyer le code"}
                                </button>
                            </div>

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
                                {newEmail && !validateEmail(newEmail) && (
                                    <p className="text-red-500 text-sm mt-1">Veuillez entrer une adresse e-mail valide</p>
                                )}
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
                                    disabled={!validateEmail(newEmail)}
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showEditPhoneModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Modifier le numéro de téléphone</h2>
                            <div className="mb-4">
                                <label htmlFor="new-phone" className="block text-sm font-medium text-gray-700 mb-1">Nouveau numéro de téléphone</label>
                                <div className="flex">
                                    <div className="flex items-center px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50">
                                        <span className="mr-1">🇫🇷</span>
                                        <span>+33</span>
                                    </div>
                                    <input
                                        type="tel"
                                        id="new-phone"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newPhoneNumber.replace(/^\+33\s?/, '').replace(/^0/, '')}
                                        onChange={(e) => {
                                            const rawInput = e.target.value.replace(/[^\d]/g, '');
                                            setNewPhoneNumber(rawInput);
                                        }}
                                        placeholder="6 12 34 56 78"
                                    />
                                </div>
                                {newPhoneNumber && !validatePhone(newPhoneNumber) && (
                                    <p className="text-red-500 text-sm mt-1">Veuillez entrer un numéro de téléphone français valide</p>
                                )}
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
                                    disabled={!validatePhone(newPhoneNumber)}
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showEditUsernameModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Modifier le nom d'utilisateur</h2>
                            <div className="mb-4">
                                <label htmlFor="new-username" className="block text-sm font-medium text-gray-700 mb-1">Nouveau nom d'utilisateur</label>
                                <input
                                    type="text"
                                    id="new-username"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                />
                                {newUsername && !validateUsername(newUsername) && (
                                    <p className="text-red-500 text-sm mt-1">Le nom d'utilisateur doit contenir entre 3 et 15 caractères sans espaces</p>
                                )}
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                                    onClick={() => setShowEditUsernameModal(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                    onClick={saveUsername}
                                    disabled={!validateUsername(newUsername)}
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showLogoutModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium text-gray-900">Attention - Contenu du panier</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Si vous vous déconnectez maintenant, le contenu de votre panier sera perdu. Êtes-vous sûr de vouloir continuer ?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                                    onClick={() => setShowLogoutModal(false)}
                                >
                                    Annuler
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                    onClick={handleLogout}
                                >
                                    Déconnexion
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Account;