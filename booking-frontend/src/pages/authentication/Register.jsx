import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Check, X, ChevronDown, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { RegisterRequest } from "../../hooks/AuthenticationHooks";
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

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [validations, setValidations] = useState({
        email: { isValid: false, message: "" },
        username: { isValid: false, message: "" },
        phone: { isValid: false, message: "" },
        password: { isValid: false, message: "" },
        confirmPassword: { isValid: false, message: "" },
    });

    const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    const PASSWORD_REGEX =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}';:",.<>?|`~])[A-Za-z\d!@#$%^&*()_+\-={}';:",.<>?|`~]{8,}$/;
    const USERNAME_REGEX = /^[^\s]{3,15}$/;
    const PHONE_REGEX = /^(\+33|0)[1-9][0-9]{8}$/;

    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        hasLowerCase: false,
        hasUpperCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        hasMinLength: false,
    });

    const showNotification = (type, message) => {
        setNotification({ type, message });
    };

    const clearNotification = () => {
        setNotification(null);
    };

    const formatPhoneNumber = (value) => {
        let phoneNumber = value.replace(/\D/g, "");

        if (phoneNumber.startsWith("0") && phoneNumber.length > 1) {
            phoneNumber = phoneNumber.substring(1);
        }

        if (phoneNumber.length > 0) {
            let formattedNumber = phoneNumber.charAt(0);

            if (phoneNumber.length > 1) {
                formattedNumber +=
                    " " +
                    phoneNumber
                        .substring(1)
                        .replace(/(\d{2})(?=\d)/g, "$1 ")
                        .trim();
            }

            return formattedNumber;
        }

        return phoneNumber;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const formattedNumber = formatPhoneNumber(value);
            setFormData({
                ...formData,
                [name]: formattedNumber,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }

        validateField(
            name,
            name === "phone" ? formatPhoneNumber(value) : value
        );
    };

    const validateField = (fieldName, value) => {
        let isValid = false;
        let message = "";

        switch (fieldName) {
            case "email":
                isValid = EMAIL_REGEX.test(value);
                message = isValid
                    ? ""
                    : "Please enter a valid email address";
                break;

            case "username":
                isValid = USERNAME_REGEX.test(value);
                message = isValid
                    ? ""
                    : "The username must contain between 3 and 15 characters, without spaces";
                break;

            case "phone": {
                const rawPhone = value.replace(/\s/g, "");
                const fullPhone = "+33" + rawPhone;
                isValid = rawPhone.length > 0 && PHONE_REGEX.test(fullPhone);
                message = isValid
                    ? ""
                    : "Please enter a valid French phone number";
                break;
            }

            case "password": {
                isValid = PASSWORD_REGEX.test(value);
                message = isValid
                    ? ""
                    : "The password does not meet the security criteria";

                const hasLowerCase = /[a-z]/.test(value);
                const hasUpperCase = /[A-Z]/.test(value);
                const hasNumber = /\d/.test(value);
                const hasSpecialChar = /[!@#$%^&*()_+\-={}';:",.<>?|`~]/.test(
                    value
                );
                const hasMinLength = value.length >= 8;

                const criteriaCount = [
                    hasLowerCase,
                    hasUpperCase,
                    hasNumber,
                    hasSpecialChar,
                    hasMinLength,
                ].filter(Boolean).length;
                const score = Math.min(100, criteriaCount * 20);

                setPasswordStrength({
                    score,
                    hasLowerCase,
                    hasUpperCase,
                    hasNumber,
                    hasSpecialChar,
                    hasMinLength,
                });

                if (formData.confirmPassword) {
                    validateField("confirmPassword", formData.confirmPassword);
                }
                break;
            }

            case "confirmPassword":
                isValid = value === formData.password && value !== "";
                message = isValid
                    ? ""
                    : "The passwords do not match";
                break;

            default:
                break;
        }

        setValidations((prev) => ({
            ...prev,
            [fieldName]: { isValid, message },
        }));

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearNotification();

        let isFormValid = true;
        Object.keys(formData).forEach((field) => {
            const fieldIsValid = validateField(field, formData[field]);
            if (!fieldIsValid) isFormValid = false;
        });

        if (isFormValid) {
            setLoading(true);
            try {
                const registerData = {
                    email: formData.email,
                    username: formData.username,
                    phoneNumber: '0'+formData.phone.trim().replace(/\s/g, ""),
                    password: formData.password,
                };

                await RegisterRequest(registerData);

                showNotification('success', "A confirmation email has been sent. Please validate your account to log in.");

                await new Promise(resolve => setTimeout(resolve, 3000));
                navigate("/connexion");
            } catch (err) {
                if (err.message.includes('500') || err.message.includes('service')) {
                    showNotification('error', "The service is currently unavailable. Please try again later.");
                } else if (err.message.includes('409')) {
                    showNotification('error', "A user with this email or username already exists.");
                } else {
                    showNotification('error', "An error occurred during registration. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        } else {
            showNotification('error', "Please correct the errors in the form.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength.score < 40) return "bg-red-500";
        if (passwordStrength.score < 60) return "bg-yellow-500";
        if (passwordStrength.score < 80) return "bg-blue-500";
        return "bg-green-500";
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow shadow-slate-300 max-w-lg mx-auto my-20 relative">
            <h1 className="text-4xl font-medium">Sign up</h1>
            <p className="text-slate-500 my-2">
                Create your account to get started 👋
            </p>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={clearNotification}
                />
            )}

            <form onSubmit={handleSubmit} className="my-10">
                <div className="flex flex-col space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="flex items-center justify-between"
                        >
                            <p className="font-medium text-slate-700 pb-2">
                                Email address{" "}
                                <span className="text-red-500">*</span>
                            </p>
                            {formData.email &&
                                (validations.email.isValid ? (
                                    <span className="text-green-500 flex items-center text-sm">
                                        <Check size={16} className="mr-1" />{" "}
                                        Valid
                                    </span>
                                ) : (
                                    <span className="text-red-500 flex items-center text-sm">
                                        <X size={16} className="mr-1" />
                                        Invalid
                                    </span>
                                ))}
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full py-3 border ${
                                validations.email.message
                                    ? "border-red-400"
                                    : "border-slate-200"
                            } rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow`}
                            placeholder="Enter your email address"
                            required
                        />
                        {validations.email.message && (
                            <p className="text-red-500 text-sm mt-1">
                                {validations.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="username"
                            className="flex items-center justify-between"
                        >
                            <p className="font-medium text-slate-700 pb-2">
                                Username{" "}
                                <span className="text-red-500">*</span>
                            </p>
                            {formData.username &&
                                (validations.username.isValid ? (
                                    <span className="text-green-500 flex items-center text-sm">
                                        <Check size={16} className="mr-1" />{" "}
                                        Valid
                                    </span>
                                ) : (
                                    <span className="text-red-500 flex items-center text-sm">
                                        <X size={16} className="mr-1" />
                                        Invalid
                                    </span>
                                ))}
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={`w-full py-3 border ${
                                validations.username.message
                                    ? "border-red-400"
                                    : "border-slate-200"
                            } rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow`}
                            placeholder="Choose a username"
                            required
                        />
                        {validations.username.message && (
                            <p className="text-red-500 text-sm mt-1">
                                {validations.username.message}
                            </p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                            Between 3 and 15 characters, no spaces
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="phone"
                            className="flex items-center justify-between"
                        >
                            <p className="font-medium text-slate-700 pb-2">
                                Phone number{" "}
                                <span className="text-red-500">*</span>
                            </p>
                            {formData.phone &&
                                (validations.phone.isValid ? (
                                    <span className="text-green-500 flex items-center text-sm">
                                        <Check size={16} className="mr-1" />{" "}
                                        Valid
                                    </span>
                                ) : (
                                    <span className="text-red-500 flex items-center text-sm">
                                        <X size={16} className="mr-1" />
                                        Invalid
                                    </span>
                                ))}
                        </label>
                        <div className="flex">
                            <div className="relative">
                                <div
                                    className="flex items-center px-3 py-3 border border-slate-200 rounded-l-lg cursor-pointer hover:bg-slate-50"
                                    onClick={toggleDropdown}
                                >
                                    <div className="flex items-center">
                                        <span className="mr-1">🇫🇷</span>
                                        <span>+33</span>
                                        <ChevronDown
                                            size={16}
                                            className="ml-1"
                                        />
                                    </div>
                                </div>
                                {showDropdown && (
                                    <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-md z-10 w-36 max-h-48 overflow-y-auto">
                                        <div
                                            className="p-2 hover:bg-slate-100 cursor-pointer flex items-center"
                                            onClick={toggleDropdown}
                                        >
                                            <span className="mr-2">🇫🇷</span>
                                            <span>France (+33)</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`flex-grow py-3 border-y border-r ${
                                    validations.phone.message
                                        ? "border-red-400"
                                        : "border-slate-200"
                                } rounded-r-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow`}
                                placeholder="6 12 34 56 78"
                                required
                            />
                        </div>
                        {validations.phone.message && (
                            <p className="text-red-500 text-sm mt-1">
                                {validations.phone.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="flex items-center justify-between"
                        >
                            <p className="font-medium text-slate-700 pb-2">
                                Password{" "}
                                <span className="text-red-500">*</span>
                            </p>
                            {formData.password &&
                                (validations.password.isValid ? (
                                    <span className="text-green-500 flex items-center text-sm">
                                        <Check size={16} className="mr-1" />{" "}
                                        Valid
                                    </span>
                                ) : (
                                    <span className="text-red-500 flex items-center text-sm">
                                        <X size={16} className="mr-1" />
                                        Invalid
                                    </span>
                                ))}
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full py-3 border ${
                                    validations.password.message
                                        ? "border-red-400"
                                        : "border-slate-200"
                                } rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow`}
                                placeholder="Create your password"
                                required
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
                        {formData.password && (
                            <div className="mt-2">
                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full ${getPasswordStrengthColor()}`}
                                        style={{
                                            width: `${passwordStrength.score}%`,
                                        }}
                                    ></div>
                                </div>
                                <div className="mt-2 text-sm">
                                    <ul className="space-y-1">
                                        <li
                                            className={`flex items-center ${
                                                passwordStrength.hasMinLength
                                                    ? "text-green-500"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {passwordStrength.hasMinLength ? (
                                                <Check
                                                    size={12}
                                                    className="mr-1"
                                                />
                                            ) : (
                                                <X size={12} className="mr-1" />
                                            )}
                                            At least 8 characters
                                        </li>
                                        <li
                                            className={`flex items-center ${
                                                passwordStrength.hasLowerCase
                                                    ? "text-green-500"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {passwordStrength.hasLowerCase ? (
                                                <Check
                                                    size={12}
                                                    className="mr-1"
                                                />
                                            ) : (
                                                <X size={12} className="mr-1" />
                                            )}
                                            At least one lowercase letter
                                        </li>
                                        <li
                                            className={`flex items-center ${
                                                passwordStrength.hasUpperCase
                                                    ? "text-green-500"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {passwordStrength.hasUpperCase ? (
                                                <Check
                                                    size={12}
                                                    className="mr-1"
                                                />
                                            ) : (
                                                <X size={12} className="mr-1" />
                                            )}
                                            At least one uppercase letter
                                        </li>
                                        <li
                                            className={`flex items-center ${
                                                passwordStrength.hasNumber
                                                    ? "text-green-500"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {passwordStrength.hasNumber ? (
                                                <Check
                                                    size={12}
                                                    className="mr-1"
                                                />
                                            ) : (
                                                <X size={12} className="mr-1" />
                                            )}
                                            At least one number
                                        </li>
                                        <li
                                            className={`flex items-center ${
                                                passwordStrength.hasSpecialChar
                                                    ? "text-green-500"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {passwordStrength.hasSpecialChar ? (
                                                <Check
                                                    size={12}
                                                    className="mr-1"
                                                />
                                            ) : (
                                                <X size={12} className="mr-1" />
                                            )}
                                            At least one special character
                                            (!@#$%^&*...)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                        {validations.password.message && (
                            <p className="text-red-500 text-sm mt-1">
                                {validations.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="flex items-center justify-between"
                        >
                            <p className="font-medium text-slate-700 pb-2">
                                Password confirmation{" "}
                                <span className="text-red-500">*</span>
                            </p>
                            {formData.confirmPassword &&
                                (validations.confirmPassword.isValid ? (
                                    <span className="text-green-500 flex items-center text-sm">
                                        <Check size={16} className="mr-1" />{" "}
                                        Valid
                                    </span>
                                ) : (
                                    <span className="text-red-500 flex items-center text-sm">
                                        <X size={16} className="mr-1" />
                                        Invalid
                                    </span>
                                ))}
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full py-3 border ${
                                    validations.confirmPassword.message
                                        ? "border-red-400"
                                        : "border-slate-200"
                                } rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow`}
                                placeholder="Confirm your password"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                        {validations.confirmPassword.message && (
                            <p className="text-red-500 text-sm mt-1">
                                {validations.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing up...
                            </>
                        ) : (
                            <>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                </svg>
                                <span>Sign up</span>
                            </>
                        )}
                    </button>

                    <p className="text-center">
                        Already registered?
                        <a
                            href="/connexion"
                            className="text-indigo-600 font-medium inline-flex space-x-1 items-center ml-1"
                        >
                            <span>Log in</span>
                            <span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />
                                </svg>
                            </span>
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Register;