import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function CreateTicketsRequest(paymentData) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        return { error: 'No authentication token found' };
    }

    try {
        const tickets = paymentData.ticketsIds.map(ticket => ({
            eventId: ticket.eventId,
            ticketCategory: ticket.type,
            price: ticket.price
        }));

        const formattedData = {
            tickets: tickets
        };

        const response = await fetch(`${API_BASE_URL}/private/tickets`, {
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
        console.error("Ticket creation error:", error);
        return { error: error.message };
    }
}

export async function CancelTicketRequest(ticketId) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/ticket/${ticketId}/cancel`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(ticketId)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function ValidateTicketRequest(ticketId) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/admin/ticket/${ticketId}/validate`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(ticketId)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}


export async function GetCurrentUserTicketsRequest() {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/tickets`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}