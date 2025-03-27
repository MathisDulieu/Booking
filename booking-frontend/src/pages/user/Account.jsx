import React, { useEffect, useState } from 'react';
import {Check, X, Eye, EyeOff, Mail, Phone, Pencil, LogOut, AlertCircle, Loader2, CheckCircle} from 'lucide-react';
import NotificationsSection from '../../components/user/NotificationsSection.jsx';
import TicketsSection from '../../components/user/TicketsSection.jsx';
import Cookies from 'js-cookie';
import {
    DeleteCurrentUserRequest,
    GetCurrentUserInfoRequest,
    UpdateEmailRequest,
    UpdatePasswordRequest,
    UpdatePhoneRequest,
    UpdateUsernameRequest
} from '../../hooks/UserHooks';

function Account() {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('idle');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPhoneValidationModal, setShowPhoneValidationModal] = useState(false);
    const [validationCode, setValidationCode] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [emailValidated, setEmailValidated] = useState(false);
    const [phoneValidated, setPhoneValidated] = useState(false);
    const [showEditEmailModal, setShowEditEmailModal] = useState(false);
    const [showEditPhoneModal, setShowEditPhoneModal] = useState(false);
    const [showEditUsernameModal, setShowEditUsernameModal] = useState(false);
    const [codeEnvoye, setCodeEnvoye] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [newUsername, setNewUsername] = useState('');
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

    const showNotification = (type, message) => {
        setError(message);
        setStatus(type);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await GetCurrentUserInfoRequest();
            const userInfo = response.informations;
            setEmail(userInfo.email);
            setUsername(userInfo.username);
            setPhoneNumber(userInfo.phoneNumber);
            setEmailValidated(userInfo.validatedEmail);
            setPhoneValidated(userInfo.validatedPhoneNumber);

            setNewEmail(userInfo.email);
            setNewUsername(userInfo.username);
            setNewPhoneNumber(userInfo.phoneNumber);
        } catch (error) {
            let errorMessage = "Failed to load user data.";

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

    const validateEmail = (value) => {
        return EMAIL_REGEX.test(value);
    };

    const validatePhone = (value) => {
        const rawPhone = value.replace(/\s/g, '');

        if (PHONE_REGEX.test(rawPhone)) {
            return true;
        }

        return /^[1-9][0-9]{8}$/.test(rawPhone);
    };

    const handleLogout = () => {
        Cookies.remove('authToken');
        window.location.href = "/connexion";
        setShowLogoutModal(false);
    };

    const sendSMSCode = () => {
        setCodeEnvoye(true);
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

    const handleSavePassword = async () => {
        const result = validatePassword(newPassword);
        if (result.isValid) {
            setLoading(true);
            setError('');
            try {
                await UpdatePasswordRequest({
                    oldPassword: currentPassword,
                    newPassword: newPassword
                });
                showNotification('success', "Password updated successfully");
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

                setTimeout(() => {
                    if (status === 'success') {
                        setStatus('idle');
                    }
                }, 5000);
            } catch (error) {
                let errorMessage = "Failed to update password.";

                if (error.message.includes('400')) {
                    if (error.message.includes('Old password is incorrect')) {
                        errorMessage = "The current password is incorrect.";
                    } else if (error.message.includes('New password must be different')) {
                        errorMessage = "New password must be different from the current one.";
                    } else if (error.message.includes('does not meet the required criteria')) {
                        errorMessage = "The new password does not meet the required criteria.";
                    } else {
                        errorMessage = "Invalid password format.";
                    }
                } else if (error.message.includes('401')) {
                    errorMessage = "Authentication required. Please login again.";
                } else if (error.message.includes('500')) {
                    errorMessage = "The service is currently unavailable. Please try again later.";
                }

                showNotification('error', errorMessage);
            } finally {
                setLoading(false);
            }
        } else {
            showNotification('error', "The password does not meet security requirements.");
        }
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteAccount = async () => {
        setLoading(true);
        setError('');
        try {
            await DeleteCurrentUserRequest();
            showNotification('success', "Account deleted successfully");
            Cookies.remove('authToken');
            setTimeout(() => {
                window.location.href = "/connexion";
            }, 2000);
        } catch (error) {
            let errorMessage = "Failed to delete account.";

            if (error.message.includes('401')) {
                errorMessage = "Authentication required. Please login again.";
            } else if (error.message.includes('500')) {
                errorMessage = "Server error. Please try again later.";
            }

            showNotification('error', errorMessage);
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
        }
    };

    const handleValidatePhone = () => {
        setShowPhoneValidationModal(true);
    };

    const submitPhoneValidation = () => {
        if (validationCode.length === 6) {
            setPhoneValidated(true);
            setShowPhoneValidationModal(false);
            showNotification('success', "Phone number validated successfully");
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

    const saveEmail = async () => {
        if (validateEmail(newEmail)) {
            setLoading(true);
            setError('');
            try {
                await UpdateEmailRequest({
                    email: newEmail
                });
                setEmail(newEmail);
                setEmailValidated(false);
                setShowEditEmailModal(false);
                showNotification('success', "Email updated successfully");

                setTimeout(() => {
                    if (status === 'success') {
                        setStatus('idle');
                    }
                }, 5000);
            } catch (error) {
                let errorMessage = "Failed to update email.";

                if (error.message.includes('400')) {
                    if (error.message.includes('already used')) {
                        errorMessage = "This email is already in use.";
                    } else if (error.message.includes('Invalid email format')) {
                        errorMessage = "Invalid email format.";
                    } else if (error.message.includes('must be different')) {
                        errorMessage = "The new email must be different from the current one.";
                    }
                } else if (error.message.includes('401')) {
                    errorMessage = "Authentication required. Please login again.";
                } else if (error.message.includes('500')) {
                    errorMessage = "The service is currently unavailable. Please try again later.";
                }

                showNotification('error', errorMessage);
            } finally {
                setLoading(false);
            }
        } else {
            showNotification('error', "Invalid email format");
        }
    };

    const savePhoneNumber = async () => {
        const rawInput = newPhoneNumber.replace(/\s/g, '');
        let formattedPhone = rawInput;

        if (rawInput.startsWith('+33')) {
            formattedPhone = rawInput;
        } else if (rawInput.startsWith('0')) {
            formattedPhone = '+33' + rawInput.substring(1);
        } else if (/^[1-9][0-9]{8}$/.test(rawInput)) {
            formattedPhone = '+33' + rawInput;
        }

        const displayPhone = formattedPhone.replace(/^\+33(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/, '+33 $1 $2 $3 $4 $5');

        setLoading(true);
        setError('');
        try {
            await UpdatePhoneRequest({
                phone: formattedPhone
            });
            setPhoneNumber(displayPhone);
            setPhoneValidated(false);
            setShowEditPhoneModal(false);
            showNotification('success', "Phone number updated successfully");

            setTimeout(() => {
                if (status === 'success') {
                    setStatus('idle');
                }
            }, 5000);
        } catch (error) {
            let errorMessage = "Failed to update phone number.";

            if (error.message.includes('400')) {
                if (error.message.includes('already used')) {
                    errorMessage = "This phone number is already in use.";
                } else if (error.message.includes('Invalid phone')) {
                    errorMessage = "Invalid phone number format.";
                }
            } else if (error.message.includes('401')) {
                errorMessage = "Authentication required. Please login again.";
            } else if (error.message.includes('500')) {
                errorMessage = "The service is currently unavailable. Please try again later.";
            }

            showNotification('error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const saveUsername = async () => {
        if (validateUsername(newUsername)) {
            setLoading(true);
            setError('');
            try {
                await UpdateUsernameRequest({
                    username: newUsername
                });
                setUsername(newUsername);
                setShowEditUsernameModal(false);
                showNotification('success', "Username updated successfully");

                setTimeout(() => {
                    if (status === 'success') {
                        setStatus('idle');
                    }
                }, 5000);
            } catch (error) {
                let errorMessage = "Failed to update username.";

                if (error.message.includes('400')) {
                    if (error.message.includes('already taken')) {
                        errorMessage = "This username is already taken.";
                    } else if (error.message.includes('Invalid username')) {
                        errorMessage = "Invalid username format.";
                    } else if (error.message.includes('cannot be the same')) {
                        errorMessage = "The new username must be different from the current one.";
                    }
                } else if (error.message.includes('401')) {
                    errorMessage = "Authentication required. Please login again.";
                } else if (error.message.includes('500')) {
                    errorMessage = "The service is currently unavailable. Please try again later.";
                }

                showNotification('error', errorMessage);
            } finally {
                setLoading(false);
            }
        } else {
            showNotification('error', "Username must be between 3 and 15 characters with no spaces");
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
                    <h1 className="py-2 text-2xl font-semibold">Account Settings</h1>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition flex items-center"
                    >
                        <LogOut size={18} className="mr-1" />
                        Logout
                    </button>
                </div>
                <hr className="mt-4 mb-8" />

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

                <div className="flex items-center justify-between mb-2">
                    <p className="py-2 text-xl font-semibold">Username</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <p className="text-gray-600">Your username is <strong>{username}</strong></p>
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
                    <p className="py-2 text-xl font-semibold">Email address</p>
                    <div className={`px-3 py-1 rounded-full ${emailValidated ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} flex items-center`}>
                        {emailValidated ? (
                            <>
                                <Check size={16} className="mr-1" />
                                <span>Verified</span>
                            </>
                        ) : (
                            <>
                                <X size={16} className="mr-1" />
                                <span>Not Verified</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <Mail size={16} className="mr-2 text-gray-600" />
                            <p className="text-gray-600">Your email address is <strong>{email}</strong></p>
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
                            Verify Email
                        </button>
                    )}
                </div>
                <hr className="mt-4 mb-8" />

                <div className="flex items-center justify-between mb-2">
                    <p className="py-2 text-xl font-semibold">Phone number</p>
                    <div className={`px-3 py-1 rounded-full ${phoneValidated ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} flex items-center`}>
                        {phoneValidated ? (
                            <>
                                <Check size={16} className="mr-1" />
                                <span>Verified</span>
                            </>
                        ) : (
                            <>
                                <X size={16} className="mr-1" />
                                <span>Not Verified</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <Phone size={16} className="mr-2 text-gray-600" />
                            <p className="text-gray-600">Your phone number is <strong>{phoneNumber}</strong></p>
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
                            Verify
                        </button>
                    )}
                </div>
                <hr className="mt-4 mb-8" />

                <p className="py-2 text-xl font-semibold">Password</p>
                <div className="flex items-center flex-wrap">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                        <label className="w-full sm:w-auto">
                            <span className="text-sm text-gray-500">Current password</span>
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
                            <span className="text-sm text-gray-500">New password</span>
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
                                    At least 8 characters
                                </li>
                                <li className={`flex items-center ${passwordStrength.hasLowerCase ? 'text-green-500' : 'text-slate-500'}`}>
                                    {passwordStrength.hasLowerCase ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                                    At least one lowercase letter
                                </li>
                                <li className={`flex items-center ${passwordStrength.hasUpperCase ? 'text-green-500' : 'text-slate-500'}`}>
                                    {passwordStrength.hasUpperCase ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                                    At least one uppercase letter
                                </li>
                                <li className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-500' : 'text-slate-500'}`}>
                                    {passwordStrength.hasNumber ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                                    At least one number
                                </li>
                                <li className={`flex items-center ${passwordStrength.hasSpecialChar ? 'text-green-500' : 'text-slate-500'}`}>
                                    {passwordStrength.hasSpecialChar ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                                    At least one special character (!@#$%^&*...)
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                <button
                    className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                    onClick={handleSavePassword}
                    disabled={!validatePassword(newPassword).isValid || !currentPassword || loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                            Updating...
                        </>
                    ) : (
                        "Save password"
                    )}
                </button>
                <hr className="mt-4 mb-8" />

                <div className="mb-10">
                    <p className="py-2 text-xl font-semibold">Delete account</p>
                    <p className="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-rose-600">
                        <AlertCircle className="mr-2 h-5 w-5" />
                        Proceed with caution
                    </p>
                    <p className="mt-2 mb-4">Make sure you've backed up your account data in case you need to access it later. We will completely delete your data. There will be no way to access your account after this action.</p>
                    <button
                        className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition flex items-center"
                        onClick={handleDeleteAccount}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                Processing...
                            </>
                        ) : (
                            "Delete permanently"
                        )}
                    </button>
                </div>
            </>
        )
    };

    if (loading && status !== 'success' && status !== 'error') {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin h-16 w-16 text-blue-500 mb-4" />
                    <p className="text-xl text-gray-600">Loading account information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="border-b py-6 text-3xl font-bold">Account Information</h1>
                <div className="grid grid-cols-8 pt-3 sm:grid-cols-10">
                    <div className="relative my-4 w-56 sm:hidden">
                        <input className="peer hidden" type="checkbox" name="select-1" id="select-1" />
                        <label htmlFor="select-1" className="flex w-full cursor-pointer select-none rounded-lg border p-2 px-3 text-sm text-gray-700 ring-blue-500 peer-checked:ring">
                            {activeTab === 'profile' ? 'Profile' : activeTab === 'notifications' ? 'Notifications' : 'Tickets'}
                        </label>
                        <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute right-0 top-3 ml-auto mr-5 h-4 text-slate-700 transition peer-checked:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                        <ul className="max-h-0 select-none flex-col overflow-hidden rounded-b-lg shadow-md transition-all duration-300 peer-checked:max-h-56 peer-checked:py-3">
                            <li
                                className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-500 hover:text-white"
                                onClick={() => setActiveTab('profile')}
                            >
                                Profile
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

                    <div className="col-span-2 hidden sm:block">
                        <ul>
                            <li
                                className={`mt-5 cursor-pointer border-l-2 ${activeTab === 'profile' ? 'border-l-blue-500 text-blue-500' : 'border-transparent'} px-2 py-2 font-semibold transition hover:border-l-blue-500 hover:text-blue-500`}
                                onClick={() => setActiveTab('profile')}
                            >
                                Profile
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
                            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                            <p className="mb-6">Are you sure you want to delete your account? This action is irreversible and all your data will be lost.</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition flex items-center"
                                    onClick={confirmDeleteAccount}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Delete Permanently"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showPhoneValidationModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Phone Number Verification</h2>

                            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-blue-700 mb-2 sm:mb-0">
                                    {codeEnvoye ?
                                        "An SMS with a 6-digit code has been sent to your phone." :
                                        "Click the button to receive a validation code via SMS."}
                                </p>
                                <button
                                    className={`px-3 py-1.5 text-sm rounded-md transition ${
                                        codeEnvoye ?
                                            "bg-gray-300 text-gray-600 cursor-not-allowed" :
                                            "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                                    onClick={sendSMSCode}
                                    disabled={codeEnvoye}
                                >
                                    {codeEnvoye ? "Code sent" : "Send code"}
                                </button>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="validation-code" className="block text-sm font-medium text-gray-700 mb-1">Validation code</label>
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
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                    onClick={submitPhoneValidation}
                                    disabled={validationCode.length !== 6}
                                >
                                    Verify
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showEditEmailModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Edit Email Address</h2>
                            <div className="mb-4">
                                <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 mb-1">New email address</label>
                                <input
                                    type="email"
                                    id="new-email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />
                                {newEmail && !validateEmail(newEmail) && (
                                    <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
                                )}
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                                    onClick={() => setShowEditEmailModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center"
                                    onClick={saveEmail}
                                    disabled={!validateEmail(newEmail) || loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showEditPhoneModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Edit Phone Number</h2>
                            <div className="mb-4">
                                <label htmlFor="new-phone" className="block text-sm font-medium text-gray-700 mb-1">New phone number</label>
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
                                    <p className="text-red-500 text-sm mt-1">Please enter a valid French phone number</p>
                                )}
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                                    onClick={() => setShowEditPhoneModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center"
                                    onClick={savePhoneNumber}
                                    disabled={!validatePhone(newPhoneNumber) || loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showEditUsernameModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Edit Username</h2>
                            <div className="mb-4">
                                <label htmlFor="new-username" className="block text-sm font-medium text-gray-700 mb-1">New username</label>
                                <input
                                    type="text"
                                    id="new-username"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                />
                                {newUsername && !validateUsername(newUsername) && (
                                    <p className="text-red-500 text-sm mt-1">Username must be between 3 and 15 characters with no spaces</p>
                                )}
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                                    onClick={() => setShowEditUsernameModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center"
                                    onClick={saveUsername}
                                    disabled={!validateUsername(newUsername) || loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save"
                                    )}
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
                                    <h3 className="text-lg font-medium text-gray-900">Warning - Cart Contents</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            If you log out now, the contents of your cart will be lost. Are you sure you want to continue?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                                    onClick={() => setShowLogoutModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                    onClick={handleLogout}
                                >
                                    Logout
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