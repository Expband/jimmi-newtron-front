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
        'hyBOKO8Ph7Uy8tT6lstatChFjwOkdfA5',
        'dev-6zx4qo7gopqnmotm.us.auth0.com',
        passwordlessOptions
    );

    lockPasswordless.show();
});