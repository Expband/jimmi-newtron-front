$('#authorize').on('click', (e) => {
    console.log(this)
    e.preventDefault();
    var button = this;
    button.disabled = true;
    var passwordlessOptions = {
        allowedConnections: ['sms'],
        passwordlessMethod: 'code',
        auth: {
            redirectUrl: 'https://www.yenebezpeka.pp.ua/loading',
            audience: "https://yen-api",
        }
    }
    var lockPasswordless = new Auth0LockPasswordless(
        'ItNrfB0zq2owCl8RUoUAc2PvTmpmLAnR', //client_id
        'dev-u5le8cq1mkql8c2t.us.auth0.com',
        passwordlessOptions
    );

    lockPasswordless.show();
});