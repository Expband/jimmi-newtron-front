const currentUrl = window.location.href;
const url = new URL(currentUrl);
const code = url.searchParams.get("code");

if (!code) {
    window.location.href = "http://127.0.0.1:9090/";
}

$(document).ready(function () {
    fetch('http://127.0.0.1:9090/authorize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to authorize');
            }
            return response.json(); // Parse JSON asynchronously
        })
        .then(data => {
            console.log(data); // Access parsed JSON data here
            localStorage.setItem('access_token', data)
        })
        .catch(error => {
            console.error(error);
        });
});
