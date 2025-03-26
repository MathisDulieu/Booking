const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function GetUserNotificationsRequest(userId) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }
    try{
        const response = await fetch(`${API_BASE_URL}/private/admin/notifications/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({userId})
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData
                    ? errorData.message || errorData
                    : "Something went wrong!"
            );
        }
    }catch(error){
        console.error(error);
    }

}

export async function GetCurrentUserNotificationsRequest() {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_BASE_URL}/private/notifications`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
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

        const responseData = await response.json();

        return responseData;
    } catch (error) {
        console.error(error);
    }
}

export async function SendNotificationRequest(notificationData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const formattedData = {
        ...notificationData
    };

    try {
        const response = await fetch(`${API_BASE_URL}/private/admin/notifications/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(formattedData)
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

export async function UpdateNotificationPreferencesRequest(notificationData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/private/admin/notifications/send`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(notificationData)
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
