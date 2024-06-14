var axios = require("axios").default;

var options = {
    method: 'POST',
    url: 'https://dev-u5le8cq1mkql8c2t.us.auth0.com/oauth/token',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: 'ItNrfB0zq2owCl8RUoUAc2PvTmpmLAnR',
        client_secret: 'h-uWEwtf9LAe527iz5nLowW-a4mdXbG2SINLLk6cofxyv95UBw8Jyb_t9hoEr6De',
        code: 'KlwwJVvJEuglGNoJ2FdFGqRI6RAY2g1FRJD2lJtrfXNc-',
        redirect_uri: 'https://jimmi-newtron-front-1129fbebcd87.herokuapp.com/waiting',
    })
};

axios.request(options).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.error(error);
});
