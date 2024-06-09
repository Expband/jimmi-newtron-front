$('#authorize').on('click', (e) => {
    console.log(this)
    e.preventDefault();
    var button = this;
    button.disabled = true;
    var passwordlessOptions = {
        allowedConnections: ['sms'],
        passwordlessMethod: 'code',
        auth: {
            redirectUrl: 'https://jimmi-newtron-front-1129fbebcd87.herokuapp.com/waiting',
            audience: "https://auth-dyploma-api",
        }
    }
    var lockPasswordless = new Auth0LockPasswordless(
        'xKh4doMSl8ByXlLW5pjqZsLLr8fQMmJw', //client_id
        'dev-u5le8cq1mkql8c2t.us.auth0.com',
        passwordlessOptions
    );

    lockPasswordless.show();
});