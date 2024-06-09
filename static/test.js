var axios = require("axios").default;

var options = {
    method: 'POST',
    url: 'https://dev-h5mzz0nq5zepl1tt.us.auth0.com/oauth/token',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: 'JkpFqGpDOoiwVJv0iEgTcBjKZPIClRR8',
        client_secret: 'YnbVSapgzJHPUlFCeHiFKYeeJ_-UDQOLyk7-dJ5loNatlHF3cF9JSAP4SN5LIUkL',
        code: '_L-jdVJAkRSo-qoe4Wmai00pzIJpzsM0PwfQbFMKvfbxg',
        redirect_uri: 'https://www.yenebezpeka.pp.ua/loading',
    })
};

axios.request(options).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.error(error);
});
