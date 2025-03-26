const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function CreateTicketsRequest(ticketData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/private/tickets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(ticketData)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData
                    ? errorData.message || errorData
                    : "Something went wrong!"
            );
        }

        const responseData = await response.json();

        return responseData;
    } catch (error) {
        console.error(error);
    }
}

export async function CancelTicketRequest() {

}

export async function CreateTicketsTicketRequest() {

}

export async function GetCurrentUserTicketsRequest() {

}