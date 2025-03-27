import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../services/CartContext";
import {
    ArrowLeft,
    Trash2,
    CreditCard,
    ChevronsRight,
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react";
import { FaPaypal } from "react-icons/fa";
import { CreateTicketsRequest } from "../../hooks/TicketHooks";
import {
    PayWithCardRequest,
    PayWithPaypalRequest,
} from "../../hooks/PaymentHooks";
import Cookies from 'js-cookie';

function Cart() {
    const { items, totalPrice, removeFromCart, clearCart } =
        useContext(CartContext);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("idle");
    const navigate = useNavigate();

    const serviceFee = totalPrice * 0.05;
    const totalAmount = totalPrice + serviceFee;

    const eventIds = [...new Set(items.map(item => item.eventId))];
    const ticketsIds = items.map(item => ({
        eventId: item.eventId,
        type: item.type,
        quantity: item.quantity,
        price: item.price
    }));
    const paymentData = {
        eventIds,
        ticketsIds,
        amount: totalAmount,
    };

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

    const handleRemoveItem = (eventId, type) => {
        removeFromCart(eventId, type);
    };

    const formatDate = (dateString) => {
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const handlePaymentMethodSelect = (method) => {
        setPaymentMethod(method);
    };


    const handleProceedToPayment = async () => {
        setIsProcessingPayment(true);
        setError("");
        setStatus("idle");

        try {
            const authToken = Cookies.get('authToken');
            if (!authToken) {
                showNotification('error', "Authentication required. Please log in again.");
                setIsProcessingPayment(false);
                return;
            }

            if (!paymentMethod) {
                showNotification('error', "Please select a payment method.");
                setIsProcessingPayment(false);
                return;
            }

            let paymentResponse;
            if (paymentMethod === "card") {
                paymentResponse = await PayWithCardRequest(paymentData);
            } else if (paymentMethod === "paypal") {
                paymentResponse = await PayWithPaypalRequest(paymentData);
            }

            if (!paymentResponse || paymentResponse.error) {
                console.error("Payment failed:", paymentResponse?.error);

                let errorMessage = paymentResponse?.error || "Payment failed.";

                if (errorMessage.includes('401')) {
                    errorMessage = "Authentication required. Please log in again.";
                } else if (errorMessage.includes('400')) {
                    errorMessage = "Invalid payment data.";
                } else if (errorMessage.includes('500')) {
                    errorMessage = "The payment service is temporarily unavailable.";
                }

                showNotification('error', errorMessage);
                setIsProcessingPayment(false);
                return;
            }

            const ticketResponse = await CreateTicketsRequest(paymentData);

            if (!ticketResponse || ticketResponse.error) {
                console.error("Ticket creation failed:", ticketResponse?.error);
                showNotification('error', ticketResponse?.error || "Failed to book tickets.");
                setIsProcessingPayment(false);
                return;
            }

            setPaymentSuccess(true);
            showNotification('success', 'Payment completed successfully!');

            setTimeout(() => {
                clearCart();
                navigate("/my-tickets");
            }, 3000);

            setIsProcessingPayment(false);
        } catch (error) {
            console.error("Unexpected error:", error);
            showNotification('error', "An unexpected error occurred. Please try again later.");
            setIsProcessingPayment(false);
        }
    };

    if (paymentSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2
                                size={40}
                                className="text-green-600"
                            />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Payment Successful!
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Your order has been processed successfully. You will be
                            redirected to your tickets.
                        </p>
                        <div className="inline-block mt-4">
                            <div className="animate-pulse bg-blue-600 text-white rounded-lg px-6 py-3 font-medium">
                                Redirecting...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isProcessingPayment) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="mb-6">
                    <Loader2 className="animate-spin h-16 w-16 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Processing your payment
                </h2>
                <p className="text-gray-600">
                    Please wait, do not close this window...
                </p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <div className="w-24 h-24 mx-auto mb-6">
                            <svg
                                className="w-full h-full text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                ></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Browse our events to find tickets that interest you.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            <ArrowLeft size={20} className="mr-2" />
                            Discover events
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    My Cart
                </h1>

                {status === 'success' && (
                    <div className="flex items-center p-4 text-sm text-green-600 bg-green-50 rounded-lg mb-6">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex items-center p-4 text-sm text-red-600 bg-red-50 rounded-lg mb-6">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold">
                                    Selected tickets
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {items.map((item, index) => (
                                    <div key={index} className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            <div className="flex-grow">
                                                <h3 className="text-lg font-medium text-gray-800">
                                                    {item.eventName}
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    {formatDate(item.date)}
                                                </p>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {item.type}
                                                    </span>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        Quantity:{" "}
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4 md:mt-0 flex items-center space-x-4">
                                                <span className="font-bold text-lg">
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toFixed(2)}{" "}
                                                    €
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveItem(
                                                            item.eventId,
                                                            item.type
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800"
                            >
                                <ArrowLeft size={16} className="mr-2" />
                                Continue shopping
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold">
                                    Order summary
                                </h2>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-600">
                                        Subtotal
                                    </span>
                                    <span className="font-medium">
                                        {totalPrice.toFixed(2)} €
                                    </span>
                                </div>

                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-600">
                                        Service fee (5%)
                                    </span>
                                    <span className="font-medium">{serviceFee.toFixed(2)} €</span>
                                </div>

                                <div className="border-t border-gray-200 my-4 pt-4">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">
                                            Total
                                        </span>
                                        <span className="font-bold text-lg">
                                            {totalAmount.toFixed(2)} €
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="font-medium mb-4">
                                        Payment method
                                    </h3>
                                    <div className="space-y-3">
                                        <div
                                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                                paymentMethod === "card"
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "hover:bg-gray-50"
                                            }`}
                                            onClick={() =>
                                                handlePaymentMethodSelect(
                                                    "card"
                                                )
                                            }
                                        >
                                            <div className="flex items-center">
                                                <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3">
                                                    {paymentMethod ===
                                                        "card" && (
                                                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                                        )}
                                                </div>
                                                <div className="flex items-center">
                                                    <CreditCard
                                                        size={20}
                                                        className="mr-2 text-gray-600"
                                                    />
                                                    <span>Credit card</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                                paymentMethod === "paypal"
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "hover:bg-gray-50"
                                            }`}
                                            onClick={() =>
                                                handlePaymentMethodSelect(
                                                    "paypal"
                                                )
                                            }
                                        >
                                            <div className="flex items-center">
                                                <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3">
                                                    {paymentMethod ===
                                                        "paypal" && (
                                                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                                        )}
                                                </div>
                                                <div className="flex items-center">
                                                    <FaPaypal
                                                        size={20}
                                                        className="mr-2 text-blue-600"
                                                    />
                                                    <span>PayPal</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleProceedToPayment}
                                    disabled={!paymentMethod}
                                    className={`mt-6 w-full py-3 rounded-lg flex items-center justify-center font-medium 
                                        ${
                                        paymentMethod
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    } 
                                        transition-colors`}
                                >
                                    Proceed to payment
                                    <ChevronsRight size={18} className="ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;