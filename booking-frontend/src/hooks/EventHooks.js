const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function GetEventByIdRequest(eventId) {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData
                    ? errorData.message || errorData
                    : "Something went wrong!"
            );
        }

        return response.json();
    } catch (error) {
        console.error(error);
    }
}

export async function GetAllEventsRequests(eventFilterData = {}, actualPage = 0, eventPerPage = 10) {
    try {
        const url = `${API_BASE_URL}/events?page=${actualPage}&pageSize=${eventPerPage}`;

        const requestBody = {
            ...eventFilterData
        };

        if (!requestBody.filter) {
            requestBody.filter = "EVENT";
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
}

export async function CreateEventRequest(eventData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const formattedData = {
        ...eventData,
        checkInDate: new Date(eventData.checkInDate).toISOString(),
        checkOutDate: new Date(eventData.checkOutDate).toISOString()
    };
    

    const response = await fetch(`${API_BASE_URL}/private/artist/event`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formattedData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    return responseData;
}

export async function DeleteEventRequest(eventId) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/artist/event/${eventId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return responseData;

}

export async function UpdateEventRequest(eventId, eventData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const formattedData = {
        ...eventData,
        startdate: new Date(eventData.checkInDate).toISOString(),
        endDate: new Date(eventData.checkOutDate).toISOString()
    };

    const response = await fetch(`${API_BASE_URL}/private/artist/event/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formattedData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    return responseData;
}

