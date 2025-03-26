import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, LogIn, Mail, RefreshCw } from 'lucide-react';
import { ValidateEmailRequest } from '../../hooks/AuthenticationHooks';


function ValidEmail() {
    const [token, setToken] = useState('');
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const pathSegments = window.location.pathname.split('/');
        const tokenFromUrl = pathSegments[pathSegments.length - 1];
        console.log(`Token from URL: ${tokenFromUrl}`);
        /*
        const urlParams = new URLSearchParams(window.location.search);

        const tokenFromUrl = urlParams.get('token');

        console.log(`Token from URL: ${tokenFromUrl}`);*/
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            validateEmail(tokenFromUrl);
        } else {
            setStatus('error');
            setMessage('Aucun jeton de validation fourni.');
        }
    }, []);

    const validateEmail = async (token) => {
        try {
            console.log('Validating email...');
            await ValidateEmailRequest(token);

            setStatus('success');
            setMessage('Votre adresse e-mail a été validée avec succès !');

            startRedirectCountdown();
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage(
                error.message ||
                "Une erreur s'est produite lors de la validation de l'e-mail. Veuillez réessayer."
            );
        }
    };

    const startRedirectCountdown = () => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    handleGoToLogin();
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    };

    const handleGoToLogin = () => {
        window.location.href = "/connexion";
    };

    const handleResendEmail = () => {
        window.location.href = "/envoyer-email-validation";
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow shadow-slate-300 max-w-lg mx-auto my-20 relative">
            <div className="absolute -top-3 -right-3">
                <div className="bg-indigo-100 rounded-full p-2">
                    <Mail className="h-6 w-6 text-indigo-600" />
                </div>
            </div>

            <h1 className="text-4xl font-medium">Validation d'e-mail</h1>
            <p className="text-slate-500 my-2">
                {status === 'loading' ? 'Vérification de votre adresse e-mail...' :
                    status === 'success' ? 'Votre compte a été activé avec succès' :
                        "Un problème est survenu lors de la validation de votre e-mail"}
            </p>

            <div className="flex justify-center py-8">
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Clock className="animate-spin h-16 w-16 text-indigo-600 mb-4" />
                        <p className="text-lg text-slate-700">Traitement de votre demande...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-100 rounded-full scale-150 opacity-30 animate-pulse"></div>
                            <CheckCircle className="h-20 w-20 text-green-600 relative z-10" />
                        </div>
                        <p className="text-lg text-slate-700 mt-6 text-center">Votre e-mail a été validé avec succès !</p>
                        <p className="text-sm text-indigo-600 mt-4">
                            Redirection vers la page de connexion dans {countdown} secondes...
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-100 rounded-full scale-150 opacity-30"></div>
                            <AlertCircle className="h-20 w-20 text-red-600 relative z-10" />
                        </div>
                        <p className="text-lg text-slate-700 mt-6 text-center">{message}</p>
                    </div>
                )}
            </div>

            {status === 'error' && (
                <div className="bg-slate-50 p-4 rounded-md">
                    <h3 className="text-md font-medium text-slate-700 mb-2">Que pouvez-vous faire maintenant ?</h3>
                    <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Vérifiez que vous utilisez le bon lien de validation</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Le lien de validation a peut-être expiré (valide pendant 24 heures)</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Vous pouvez demander un nouvel e-mail de validation</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Contactez le support si vous continuez à rencontrer des problèmes</span>
                        </li>
                    </ul>
                </div>
            )}

            <div className={`border-t border-slate-200 pt-6 mt-6 ${status === 'success' ? 'opacity-70' : ''}`}>
                <div className="text-center space-y-4">
                    {status === 'success' ? (
                        <button
                            onClick={handleGoToLogin}
                            className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                        >
                            <LogIn className="h-5 w-5 mr-2" />
                            <span>Se connecter</span>
                        </button>
                    ) : status === 'error' ? (
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleResendEmail}
                                className="flex justify-center items-center py-3 px-4 border border-indigo-300 rounded-lg shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Nouvelle validation
                            </button>
                            <button
                                onClick={handleGoToLogin}
                                className="flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none"
                            >
                                <LogIn className="h-4 w-4 mr-2" />
                                Se connecter
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <span className="inline-block w-8 h-1 bg-slate-200 rounded-full animate-pulse"></span>
                            <span className="inline-block w-8 h-1 mx-1 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                            <span className="inline-block w-8 h-1 bg-slate-200 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ValidEmail;