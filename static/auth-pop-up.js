$('#authorize').on('click', (e) => {
    console.log(this)
    e.preventDefault();
    var button = this;
    button.disabled = true;
    var passwordlessOptions = {
        allowedConnections: ['sms'],
        passwordlessMethod: 'code',
        auth: {
            redirectUrl: 'https://jimmi-newtron-8bfd33f87c1a.herokuapp.com/authorize',
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