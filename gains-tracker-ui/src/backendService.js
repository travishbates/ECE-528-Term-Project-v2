const BASE_URL = "http://localhost:8000";

export function getTransactions(page, pageSize) {
    return fetch(BASE_URL + "/transactions?page=" + page + "&pageSize=" + pageSize)
        .then(response => response.json());
}

export function deleteTransaction(transactionId) {
    return fetch(BASE_URL + "/transaction/" + transactionId)
        .then(response => response.json());
}

export function uploadTransactions(formData) {
    return fetch(BASE_URL + "/transactions",
        {
            method: "POST",
            body: formData
        })
        .then(response => response.json());
}