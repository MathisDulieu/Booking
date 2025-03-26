const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function CreateUserRequest(userData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/private/admin/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(userData)
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

export async function DeleteCurrentUserRequest() {
    const authToken = localStorage.getItem('authToken');

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
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_BASE_URL}/private/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${authToken}`
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

export async function GetUserByIdRequest(userId) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }
    try {
        const response = await fetch(`${API_BASE_URL}/private/admin/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${authToken}`
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

export async function UpdateEmailRequest(userData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/private/user/email`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(userData)
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

export async function UpdatePasswordRequest(userData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/private/user/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(userData)
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

export async function UpdatePhoneRequest(userData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/private/user/phone`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(userData)
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

export async function UpdateUsernameRequest(userData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/private/user/username`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(userData)
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

export async function UpdateUserRequest(userData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/private/admin/user`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify(userData)
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