$('#authorize').on('click', (e) => {
    console.log(this)
    e.preventDefault();
    var button = this;
    button.disabled = true;
    var passwordlessOptions = {
        allowedConnections: ['sms'],
        passwordlessMethod: 'code',
        auth: {
            redirectUrl: 'http://127.0.0.1:9090/waiting',
            audience: "https://electro-managment.com",
        }
    }
    var lockPasswordless = new Auth0LockPasswordless(
        '80mrs1T5Mk4YwHs4IZOkRFNJrVxa5nNE',
        'dev-6zx4qo7gopqnmotm.us.auth0.com',
        passwordlessOptions
    );

    lockPasswordless.show();
});