const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function PayWithCardRequest(paymentData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }
    try{
        const response = await fetch(`${API_BASE_URL}/private/payment/card`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({paymentData})
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

export async function PayWithPaypalRequest(paymentData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }
    try{
        const response = await fetch(`${API_BASE_URL}/private/payment/paypal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({paymentData})
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