import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function PayWithCardRequest(paymentData) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        return { error: 'No authentication token found' };
    }

    try {
        const formattedData = {
            eventId: paymentData.eventIds[0],
            ticketsIds: paymentData.ticketsIds.map(ticket => ticket.id),
            amount: paymentData.amount
        };

        const response = await fetch(`${API_BASE_URL}/private/payment/card`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(formattedData)
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Payment error:", error);
        return { error: error.message };
    }
}

export async function PayWithPaypalRequest(paymentData) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        return { error: 'No authentication token found' };
    }

    try {
        const formattedData = {
            eventId: paymentData.eventIds[0],
            ticketsIds: paymentData.ticketsIds.map(ticket => ticket.id),
            amount: paymentData.amount
        };

        const response = await fetch(`${API_BASE_URL}/private/payment/paypal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(formattedData)
        });

        if (!response.ok) {
            return { error: `HTTP error! status: ${response.status}` };
        }

        return await response.json();
    } catch (error) {
        console.error("Payment error:", error);
        return { error: error.message };
    }
}