import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X, Mail, Clock, AlertCircle, CheckCircle, LogIn } from 'lucide-react';

function SendValidationEmail() {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [canSend, setCanSend] = useState(true);

    const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (countdown === 0 && !canSend) {
            setCanSend(true);
        }

        return () => clearTimeout(timer);
    }, [countdown, canSend]);

    const handleSendEmail = async () => {
        if (!EMAIL_REGEX.test(email)) {
            setError('Veuillez entrer une adresse e-mail valide');
            return;
        }

        if (!canSend) {
            return;
        }

        setError('');
        setIsLoading(true);
        setCanSend(false);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSent(true);
            setCanSend(false);
            setCountdown(60);

            setTimeout(() => {
                setIsSent(false);
            }, 5000);
        } catch (error) {
            setError("Une erreur s'est produite lors de l'envoi de l'email.");
            setCanSend(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToLogin = () => {
        // Navigation vers la page de connexion
        window.location.href = "/connexion";
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow shadow-slate-300 max-w-lg mx-auto my-20">
            <h1 className="text-4xl font-medium">Confirmation du compte</h1>
            <p className="text-slate-500 my-2">Recevez un lien de validation par e-mail pour activer votre compte 👋</p>

            <div className="my-10">
                <div className="flex flex-col space-y-5">
                    <div>
                        <label htmlFor="email" className="flex items-center justify-between">
                            <p className="font-medium text-slate-700 pb-2">Adresse e-mail <span className="text-red-500">*</span></p>
                            {email && (
                                EMAIL_REGEX.test(email) ?
                                    <span className="text-green-500 flex items-center text-sm"><Check size={16} className="mr-1" /> Valide</span> :
                                    <span className="text-red-500 flex items-center text-sm"><X size={16} className="mr-1" /> Non valide</span>
                            )}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                className={`w-full py-3 border ${error ? 'border-red-400' : 'border-slate-200'} rounded-lg pl-10 pr-20 focus:outline-none focus:border-indigo-500 hover:shadow`}
                                placeholder="Entrez votre adresse e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 text-white rounded-md ${
                                    canSend
                                        ? 'bg-indigo-600 hover:bg-indigo-500'
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                                onClick={handleSendEmail}
                                disabled={!canSend || isLoading}
                            >
                                {isLoading ? (
                                    <Clock className="animate-spin h-5 w-5" />
                                ) : (
                                    "Envoyer"
                                )}
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>

                    {isSent && (
                        <div className="flex items-center p-3 text-sm text-green-600 bg-green-50 rounded-md">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span>E-mail de confirmation envoyé avec succès !</span>
                        </div>
                    )}

                    {!canSend && countdown > 0 && (
                        <div className="flex items-center p-3 text-sm text-indigo-600 bg-indigo-50 rounded-md">
                            <Clock className="h-5 w-5 mr-2" />
                            <span>Vous pourrez envoyer un autre e-mail dans {countdown} secondes</span>
                        </div>
                    )}

                    <div className="bg-slate-50 p-4 rounded-md">
                        <h3 className="text-md font-medium text-slate-700 mb-2">Informations importantes</h3>
                        <ul className="text-sm text-slate-600 space-y-2">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Nous vous enverrons un lien de validation pour confirmer votre adresse e-mail.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Le lien sera valide pendant 24 heures.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Veuillez vérifier votre boîte de réception et votre dossier spam.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Si vous ne recevez pas l'e-mail, vous pouvez en demander un autre après le décompte.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="border-t border-slate-200 pt-6 mt-6">
                        <div className="text-center space-y-4">
                            <p className="text-sm text-slate-600">
                                Vous avez déjà un compte ?
                            </p>
                            <button
                                onClick={handleGoToLogin}
                                className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                            >
                                <LogIn className="h-5 w-5 mr-2" />
                                <span>Se connecter</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SendValidationEmail;