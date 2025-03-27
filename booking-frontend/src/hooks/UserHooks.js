const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import Cookies from 'js-cookie';

export async function CreateUserRequest(userData) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/admin/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function DeleteCurrentUserRequest() {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/user`, {
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

export async function GetCurrentUserInfoRequest() {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${authToken}`
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function GetUserByIdRequest(userId) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/admin/user/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${authToken}`
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function UpdateEmailRequest(userData) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/user/email`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

}

export async function UpdatePasswordRequest(userData) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/user/password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

}

export async function UpdatePhoneRequest(userData) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/user/phone`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

}

export async function UpdateUsernameRequest(userData) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/user/username`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

}

export async function UpdateUserRequest(userData) {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/admin/user`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

}