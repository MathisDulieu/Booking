import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, LogIn, Mail, RefreshCw, Loader2 } from 'lucide-react';
import { ValidateEmailRequest } from '../../hooks/AuthenticationHooks';

function ValidEmail() {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState(5);
    const [loading, setLoading] = useState(false);

    const showNotification = (type, message) => {
        setMessage(message);
    };

    useEffect(() => {
        const pathSegments = window.location.pathname.split('/');
        const tokenFromUrl = pathSegments[pathSegments.length - 1];

        if (tokenFromUrl) {
            validateEmail(tokenFromUrl);
        } else {
            setStatus('error');
            showNotification('error', 'No validation token provided.');
        }
    }, []);

    const validateEmail = async (token) => {
        try {
            await ValidateEmailRequest(token);

            setStatus('success');
            showNotification('success', 'Your email address has been successfully validated!');

            startRedirectCountdown();
        } catch (error) {
            setStatus('error');
            let errorMessage = "An error occurred while validating the email.";

            if (error.message.includes('400')) {
                errorMessage = "The validation link is invalid.";
            } else if (error.message.includes('401')) {
                errorMessage = "The validation link has expired.";
            } else if (error.message.includes('500')) {
                errorMessage = "The service is currently unavailable. Please try again later.";
            }

            showNotification('error', errorMessage);
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
        setLoading(true);
        window.location.href = "/envoyer-email-validation";
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow shadow-slate-300 max-w-lg mx-auto my-20 relative">
            <div className="absolute -top-3 -right-3">
                <div className={`rounded-full p-2 ${status === 'error' ? 'bg-red-100' : 'bg-indigo-100'}`}>
                    {status === 'error' ? (
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    ) : (
                        <Mail className="h-6 w-6 text-indigo-600" />
                    )}
                </div>
            </div>

            <h1 className="text-4xl font-medium">Email Validation</h1>
            <p className="text-slate-500 my-2">
                {status === 'loading' ? 'Verifying your email address...' :
                    status === 'success' ? 'Your account has been successfully activated' :
                        "A problem occurred while validating your email"}
            </p>

            <div className="flex justify-center py-8">
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Clock className="animate-spin h-16 w-16 text-indigo-600 mb-4" />
                        <p className="text-lg text-slate-700">Processing your request...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-100 rounded-full scale-150 opacity-30 animate-pulse"></div>
                            <CheckCircle className="h-20 w-20 text-green-600 relative z-10" />
                        </div>
                        <p className="text-lg text-slate-700 mt-6 text-center">Your email has been successfully validated!</p>
                        <p className="text-sm text-indigo-600 mt-4">
                            Redirecting to login page in {countdown} seconds...
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center w-full">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-red-100 rounded-full scale-150 opacity-30"></div>
                            <AlertCircle className="h-20 w-20 text-red-600 relative z-10" />
                        </div>
                        <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center w-full max-w-md">
                            <p className="text-lg font-semibold text-red-800 mb-2">Validation Error</p>
                            <p className="text-red-700">{message}</p>
                        </div>
                    </div>
                )}
            </div>

            {status === 'error' && (
                <div className="bg-slate-50 p-4 rounded-md mt-6">
                    <h3 className="text-md font-medium text-slate-700 mb-2">What can you do now?</h3>
                    <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Check that you are using the correct validation link</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>The validation link may have expired (valid for 24 hours)</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>You can request a new validation email</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Contact support if you continue to experience problems</span>
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
                            <span>Log in</span>
                        </button>
                    ) : status === 'error' ? (
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleResendEmail}
                                className="flex justify-center items-center py-3 px-4 border border-indigo-300 rounded-lg shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Resend validation
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleGoToLogin}
                                className="flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none"
                            >
                                <LogIn className="h-4 w-4 mr-2" />
                                Log in
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