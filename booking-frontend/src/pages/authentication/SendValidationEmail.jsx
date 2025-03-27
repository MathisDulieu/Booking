import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X, Mail, Clock, AlertCircle, CheckCircle, LogIn, Loader2 } from 'lucide-react';
import { ResendEmailValidationRequest } from '../../hooks/AuthenticationHooks';

function SendValidationEmail() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');
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

    const showNotification = (type, message) => {
        setMessage(message);
        setStatus(type);
    };

    const handleSendEmail = async () => {
        if (!EMAIL_REGEX.test(email)) {
            showNotification('error', 'Please enter a valid email address');
            return;
        }

        if (!canSend) {
            return;
        }

        setMessage('');
        setStatus('loading');
        setCanSend(false);

        try {
            await ResendEmailValidationRequest({ email });
            setStatus('success');
            showNotification('success', 'Confirmation email sent successfully!');
            setCanSend(false);
            setCountdown(60);

            setTimeout(() => {
                if (status === 'success') {
                    setStatus('idle');
                }
            }, 5000);
        } catch (error) {
            let errorMessage = "An error occurred while sending the email.";

            if (error.message.includes('400')) {
                errorMessage = "This email address has already been validated.";
            } else if (error.message.includes('404')) {
                errorMessage = "No account found with this email address.";
            } else if (error.message.includes('429')) {
                errorMessage = "Too many requests. Please wait before trying again.";
            } else if (error.message.includes('500')) {
                if (error.message.includes('Failed to send')) {
                    errorMessage = "Failed to send the confirmation email. Please try again later.";
                } else {
                    errorMessage = "The service is currently unavailable. Please try again later.";
                }
            }

            showNotification('error', errorMessage);
            setCanSend(true);
        }
    };

    const handleGoToLogin = () => {
        window.location.href = "/login";
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

            <h1 className="text-4xl font-medium">Account Confirmation</h1>
            <p className="text-slate-500 my-2">Receive a validation link by email to activate your account 👋</p>

            <div className="my-10">
                <div className="flex flex-col space-y-5">
                    <div>
                        <label htmlFor="email" className="flex items-center justify-between">
                            <p className="font-medium text-slate-700 pb-2">Email address <span className="text-red-500">*</span></p>
                            {email && (
                                EMAIL_REGEX.test(email) ?
                                    <span className="text-green-500 flex items-center text-sm"><Check size={16} className="mr-1" /> Valid</span> :
                                    <span className="text-red-500 flex items-center text-sm"><X size={16} className="mr-1" /> Invalid</span>
                            )}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                className={`w-full py-3 border ${status === 'error' ? 'border-red-400' : 'border-slate-200'} rounded-lg pl-10 pr-20 focus:outline-none focus:border-indigo-500 hover:shadow`}
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 text-white rounded-md ${
                                    canSend && email
                                        ? 'bg-indigo-600 hover:bg-indigo-500'
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                                onClick={handleSendEmail}
                                disabled={!canSend || status === 'loading' || !email}
                            >
                                {status === 'loading' ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    "Send"
                                )}
                            </button>
                        </div>
                    </div>

                    {status === 'error' && (
                        <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center w-full">
                            <p className="text-lg font-semibold text-red-800 mb-2">Error</p>
                            <p className="text-red-700">{message}</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex items-center p-3 text-sm text-green-600 bg-green-50 rounded-md">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span>Confirmation email sent successfully!</span>
                        </div>
                    )}

                    {!canSend && countdown > 0 && (
                        <div className="flex items-center p-3 text-sm text-indigo-600 bg-indigo-50 rounded-md">
                            <Clock className="h-5 w-5 mr-2" />
                            <span>You can send another email in {countdown} seconds</span>
                        </div>
                    )}

                    <div className="bg-slate-50 p-4 rounded-md">
                        <h3 className="text-md font-medium text-slate-700 mb-2">Important Information</h3>
                        <ul className="text-sm text-slate-600 space-y-2">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>We will send you a validation link to confirm your email address.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>The link will be valid for 24 hours.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Please check your inbox and spam folder.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>If you don't receive the email, you can request another one after the countdown.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="border-t border-slate-200 pt-6 mt-6">
                        <div className="text-center space-y-4">
                            <p className="text-sm text-slate-600">
                                Already have an account?
                            </p>
                            <button
                                onClick={handleGoToLogin}
                                className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                            >
                                <LogIn className="h-5 w-5 mr-2" />
                                <span>Log in</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SendValidationEmail;