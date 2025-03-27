import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, AlertTriangle, CheckCircle, Info, Clock, Loader2 } from 'lucide-react';
import { GetCurrentUserNotificationsRequest, UpdateNotificationPreferencesRequest } from '../../hooks/NotificationHooks';
import Cookies from 'js-cookie';

function NotificationsSection() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('idle');

    const [preferences, setPreferences] = useState({
        allNotificationsEnabled: true,
        emailNotificationsEnabled: true,
        smsNotificationsEnabled: false
    });

    const [preferencesLoading, setPreferencesLoading] = useState(false);

    const showNotification = (type, message) => {
        setError(message);
        setStatus(type);

        if (type === 'success') {
            setTimeout(() => {
                if (status === 'success') {
                    setStatus('idle');
                }
            }, 5000);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        setError('');
        try {
            const authToken = Cookies.get('authToken');

            if (!authToken) {
                showNotification('error', 'Authentication required. Please login again.');
                setLoading(false);
                return;
            }

            const response = await GetCurrentUserNotificationsRequest();

            if (response.warning) {
                setNotifications([]);
            } else if (response.notifications && response.notifications.notifications) {
                const mappedNotifications = response.notifications.notifications.map(notification => ({
                    id: notification.id,
                    type: mapNotificationType(notification.type),
                    title: notification.title || getDefaultTitleByType(notification.type),
                    message: notification.message,
                    date: notification.timestamp,
                    read: notification.read
                }));

                setNotifications(mappedNotifications);
            }
        } catch (error) {
            let errorMessage = "Failed to load notifications.";

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

    const updatePreferences = async (updatedPreferences) => {
        setPreferencesLoading(true);
        setError('');
        try {
            const authToken = Cookies.get('authToken');

            if (!authToken) {
                showNotification('error', 'Authentication required. Please login again.');
                setPreferencesLoading(false);
                return;
            }

            const apiPreferences = {
                email: updatedPreferences.emailNotificationsEnabled && updatedPreferences.allNotificationsEnabled,
                sms: updatedPreferences.smsNotificationsEnabled && updatedPreferences.allNotificationsEnabled,
            };

            await UpdateNotificationPreferencesRequest(apiPreferences);

            setPreferences(updatedPreferences);
            showNotification('success', 'Notification preferences updated successfully');
        } catch (error) {
            let errorMessage = "Failed to update notification preferences.";

            if (error.message.includes('400')) {
                errorMessage = "Invalid notification preferences format.";
            } else if (error.message.includes('401')) {
                errorMessage = "Authentication required. Please login again.";
            } else if (error.message.includes('404')) {
                errorMessage = "User not found.";
            } else if (error.message.includes('500')) {
                errorMessage = "The service is currently unavailable. Please try again later.";
            }

            showNotification('error', errorMessage);
        } finally {
            setPreferencesLoading(false);
        }
    };

    const mapNotificationType = (backendType) => {
        switch (backendType) {
            case 'INFORMATION':
                return 'info';
            case 'VALID':
                return 'success';
            case 'WARNING':
                return 'warning';
            case 'ERROR':
                return 'error';
            case 'MESSAGE':
                return 'message';
            default:
                return 'info';
        }
    };

    const getDefaultTitleByType = (type) => {
        switch (type) {
            case 'INFORMATION':
                return 'Information';
            case 'VALID':
                return 'Success';
            case 'WARNING':
                return 'Warning';
            case 'ERROR':
                return 'Error';
            case 'MESSAGE':
                return 'New Message';
            default:
                return 'Notification';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return "Today, " + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (diffInDays === 1) {
            return "Yesterday, " + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (diffInDays < 7) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[date.getDay()] + ', ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
        }
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'info':
                return <Info size={20} className="text-blue-500" />;
            case 'success':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'warning':
                return <AlertTriangle size={20} className="text-yellow-500" />;
            case 'error':
                return <AlertTriangle size={20} className="text-red-500" />;
            case 'message':
                return <MessageSquare size={20} className="text-purple-500" />;
            default:
                return <Bell size={20} className="text-gray-500" />;
        }
    };

    const handleToggleAllNotifications = () => {
        const updatedPreferences = {
            ...preferences,
            allNotificationsEnabled: !preferences.allNotificationsEnabled
        };
        setPreferences(updatedPreferences);
        updatePreferences(updatedPreferences);
    };

    const handleToggleEmailNotifications = () => {
        const updatedPreferences = {
            ...preferences,
            emailNotificationsEnabled: !preferences.emailNotificationsEnabled
        };
        setPreferences(updatedPreferences);
        updatePreferences(updatedPreferences);
    };

    const handleToggleSmsNotifications = () => {
        const updatedPreferences = {
            ...preferences,
            smsNotificationsEnabled: !preferences.smsNotificationsEnabled
        };
        setPreferences(updatedPreferences);
        updatePreferences(updatedPreferences);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 sm:py-16 flex justify-center items-center">
                <Loader2 className="animate-spin h-12 w-12 sm:h-16 sm:w-16 text-blue-500" />
                <p className="ml-4 text-lg text-gray-600">Loading notifications...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Notification Preferences</h1>

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

                <div className="mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center">
                                <Bell size={20} className="text-gray-500 mr-3" />
                                <span className="text-gray-800 font-medium">All notifications</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={preferences.allNotificationsEnabled}
                                    onChange={handleToggleAllNotifications}
                                    disabled={preferencesLoading}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                {preferencesLoading && (
                                    <Loader2 className="animate-spin h-4 w-4 ml-2" />
                                )}
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b pl-8">
                            <div className="flex items-center">
                                <Mail size={18} className="text-gray-500 mr-3" />
                                <span className="text-gray-700">Email notifications</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={preferences.emailNotificationsEnabled && preferences.allNotificationsEnabled}
                                    onChange={handleToggleEmailNotifications}
                                    disabled={!preferences.allNotificationsEnabled || preferencesLoading}
                                />
                                <div className={`w-11 h-6 ${!preferences.allNotificationsEnabled ? 'bg-gray-100' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
                                {preferencesLoading && (
                                    <Loader2 className="animate-spin h-4 w-4 ml-2" />
                                )}
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-2 pl-8">
                            <div className="flex items-center">
                                <MessageSquare size={18} className="text-gray-500 mr-3" />
                                <span className="text-gray-700">SMS notifications</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={preferences.smsNotificationsEnabled && preferences.allNotificationsEnabled}
                                    onChange={handleToggleSmsNotifications}
                                    disabled={!preferences.allNotificationsEnabled || preferencesLoading}
                                />
                                <div className={`w-11 h-6 ${!preferences.allNotificationsEnabled ? 'bg-gray-100' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
                                {preferencesLoading && (
                                    <Loader2 className="animate-spin h-4 w-4 ml-2" />
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Recent Notifications</h2>
                        <div className="flex items-center space-x-4">
                            <button
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                onClick={fetchNotifications}
                            >
                                <RefreshCw size={16} className="mr-1" />
                                Refresh
                            </button>
                            {notifications.some(n => !n.read) && (
                                <button
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                    onClick={markAllAsRead}
                                >
                                    <CheckCircle size={16} className="mr-1" />
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>

                    {notifications.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4">
                                <Bell size={64} className="text-gray-300 w-full h-full" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">No notifications</h3>
                            <p className="text-gray-500">You haven't received any notifications yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${
                                        notification.read ? 'border-gray-200' :
                                            notification.type === 'info' ? 'border-blue-500' :
                                                notification.type === 'success' ? 'border-green-500' :
                                                    notification.type === 'warning' ? 'border-yellow-500' :
                                                        notification.type === 'error' ? 'border-red-500' :
                                                            'border-purple-500'
                                    }`}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className={`text-base font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                                    {notification.title}
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    {!notification.read && (
                                                        <button
                                                            className="text-blue-600 hover:text-blue-800"
                                                            onClick={() => markAsRead(notification.id)}
                                                            title="Mark as read"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        className="text-gray-400 hover:text-gray-600"
                                                        onClick={() => deleteNotification(notification.id)}
                                                        title="Delete"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'} mt-1`}>
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center mt-2 text-xs text-gray-500">
                                                <Clock size={14} className="mr-1" />
                                                {formatDate(notification.date)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Mail({ size, className }) {
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
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
    );
}

function SmartphoneNotif({ size, className }) {
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
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
            <path d="M12 18h.01"></path>
            <path d="M18 7c1.1 0 2 .9 2 2v.5a2.5 2.5 0 0 1-2.5 2.5.2.2 0 0 0-.2.2v.8a.2.2 0 0 0 .2.2 2.5 2.5 0 0 1 2.5 2.5v.5c0 1.1-.9 2-2 2"></path>
        </svg>
    );
}

function Trash({ size, className }) {
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
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
    );
}

function RefreshCw({ size, className }) {
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
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
        </svg>
    );
}

export default NotificationsSection;