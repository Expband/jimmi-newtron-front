const currentUrl = window.location.href;
const url = new URL(currentUrl);
const code = url.searchParams.get("code");

// if (!code) {
//     window.location.href = "https://jimmi-newtron-front-1129fbebcd87.herokuapp.com/";
// }

$(document).ready(function () {
    fetch('https://jimmi-newtron-8bfd33f87c1a.herokuapp.com/auth/authorize_code', {
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
            // window.location.href="/"
        })
        .catch(error => {
            console.error(error);
        });
});
