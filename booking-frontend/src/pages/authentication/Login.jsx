import React, { useState, useContext, useEffect } from "react";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { LoginRequest } from "../../hooks/AuthenticationHooks";
import { AuthContext } from "../../services/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Notification = ({ type, message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 6000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        switch(type) {
            case 'success':
                return <CheckCircle2 className="text-green-500 mr-2" />;
            case 'error':
                return <AlertCircle className="text-red-500 mr-2" />;
            default:
                return null;
        }
    };

    return (
        <div
            className={`
                w-full mb-4
                flex items-center 
                px-4 py-3 rounded-lg shadow-lg 
                animate-slide-in-right
                ${type === 'success'
                ? 'bg-green-50 border-green-500 text-green-800'
                : 'bg-red-50 border-red-500 text-red-800'
            }
            `}
        >
            {getIcon()}
            <span className="font-medium">{message}</span>
            <button
                onClick={onClose}
                className="ml-4 hover:bg-opacity-10 rounded-full"
            >
                ✕
            </button>
        </div>
    );
};

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const { setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
    };

    const clearNotification = () => {
        setNotification(null);
    };

    const setCookie = (name, value, days) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearNotification();

        if (!email || !password) {
            showNotification('error', "Please fill in all fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification('error', "Invalid email address.");
            return;
        }

        setLoading(true);
        try {
            const response = await LoginRequest({ email, password });

            if (response.authToken) {
                setCookie("authToken", response.authToken, 7);

                setIsAuthenticated(true);

                showNotification('success', "Authentication successful!");

                await new Promise(resolve => setTimeout(resolve, 2000));
                navigate("/");
            } else {
                showNotification('error', "Login failed. Please check your credentials.");
            }
        } catch (err) {
            if (err.message.includes('500') || err.message.includes('service')) {
                showNotification('error', "The service is currently unavailable. Please try again later.");
            } else if (err.message.includes('401')) {
                showNotification('error', "Incorrect credentials. Please try again.");
            } else if (err.message.includes('403')) {
                showNotification('error', "Your email has not been validated yet.");
            } else {
                showNotification('error', "The service is currently unavailable. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto my-20 relative">
            <h1 className="text-4xl font-medium">Login</h1>
            <p className="text-slate-500 my-2">
                Hello, nice to see you again 👋
            </p>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={clearNotification}
                />
            )}

            <form onSubmit={handleSubmit} className="my-16">
                <div className="flex flex-col space-y-5">
                    <label htmlFor="email">
                        <p className="font-medium text-slate-700 pb-2">
                            Email Address
                        </p>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                            placeholder="Enter your email address"
                        />
                    </label>
                    <label htmlFor="password" className="relative">
                        <p className="font-medium text-slate-700 pb-2">
                            Password
                        </p>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                    </label>
                    <div className="flex flex-row justify-between">
                        <a
                            href="/envoyer-email-validation"
                            className="font-medium text-indigo-600"
                        >
                            Email not validated?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            "Log In"
                        )}
                    </button>
                    <p className="text-center">
                        Not registered yet?
                        <a
                            href="/inscription"
                            className="text-indigo-600 font-medium inline-flex space-x-1 items-center"
                        >
                            <span> Sign up now </span>
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Login;
