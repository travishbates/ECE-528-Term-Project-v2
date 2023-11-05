import {auth} from "./firebase";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

async function getIdToken() {
    const currentUser = await auth.currentUser;

    if (currentUser) {
        return currentUser.getIdToken();
    }

    return null;
}

export async function getTransactions(page, pageSize) {
    return fetch(BASE_URL + "/transactions?page=" + page + "&pageSize=" + pageSize, {
        headers: {
            Authorization: await getIdToken()
        }
    })
        .then(response => response.json());
}

export async function getReports(page, pageSize) {
    return fetch(BASE_URL + "/reports?page=" + page + "&pageSize=" + pageSize, {
        headers: {
            Authorization: await getIdToken()
        }
    })
        .then(response => response.json());
}

export async function getReport(id) {
    return fetch(BASE_URL + "/report/" + id, {
        headers: {
            Authorization: await getIdToken()
        }
    })
        .then(response => response.blob())
        .then(response => {
            const anchor = document.createElement("a");
            anchor.href = window.URL.createObjectURL(response);
            anchor.download = "report.csv";
            anchor.click();
        });
}

export async function deleteTransaction(transactionId) {
    return fetch(BASE_URL + "/transaction/" + transactionId, {
        headers: {
            Authorization: await getIdToken()
        }
    })
        .then(response => response.json());
}

export async function uploadTransactions(formData) {
    return fetch(BASE_URL + "/transactions",
        {
            method: "POST",
            body: formData,
            headers: {
                Authorization: await getIdToken()
            }
        })
        .then(response => response.json());
}

export async function requestReport(startDate, endDate) {
    return fetch(BASE_URL + "/reports/request",
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: await getIdToken()
            },
            body: JSON.stringify({
                startDate,
                endDate
            })
        })
}

export async function chatWithBot(message) {
    return "This is a mock bot message. I will reply to '" + message + "' when I am implemented.";

    // return fetch(BASE_URL + "/chat",
    //     {
    //         method: "POST",
    //         headers: {
    //             "content-type": "application/json",
    //             Authorization: await getIdToken()
    //         },
    //         body: JSON.stringify({
    //             startDate,
    //             endDate
    //         })
    //     })
    //     .then(response => {
    //         // Fill in message handling code.
    //     });
}