# sampleApp-express-auth0

This app displays the Auth0 tenant's enabled clients and the rules applying to each application.

This app  uses [Passport](https://www.passportjs.org/) and the [`passport-openidconnect`](https://www.passportjs.org/packages/passport-openidconnect/) strategy with [Express](https://expressjs.com/) to sign users in via [Auth0](https://auth0.com/).

This app implements the features of a typical [TodoMVC](https://todomvc.com/)
app, and adds sign in functionality.  This app is a traditional web application,
in which all application logic and data persistence is handled on the server.

## Quick Start

To run this app, clone the repository and install dependencies:


This app must be configured with an Auth0 domain, as well as a client ID and
secret that has been created for the app.

Once credentials have been obtained, create a `.env` file and add the following
environment variables:

```
AUTH0_DOMAIN=example.us.auth0.com
AUTH0_CLIENT_ID=__INSERT_CLIENT_ID_HERE__
AUTH0_CLIENT_SECRET=__INSERT_CLIENT_SECRET_HERE__

MANAGEMENT_API_URL=https://[tenant].[region].auth0.com/api/v2/

TOKEN_URL=https://[tenant].[region].auth0.com/oauth/token
CLIENTS_URL=https://[tenant].[region].auth0.com/api/v2/clients
RULES_URL=https://[tenant].[region].auth0.com/api/v2/rules

API_EXPLORER_CLIENT_ID= [your API Explorer Client Id]
API_EXPLORER_SECRET= [your API Explorer Client Secret]
```

Start the server.

```bash
$ npm start
```

Navigate to [`http://localhost:3000`](http://localhost:3000).


HTML pages  are rendered via [EJS](https://ejs.co/) templates and styled with vanilla CSS.  

After users sign in, a login session is established and maintained between the
server and the browser with a cookie.  As authenticated users interact with the
app, creating and editing todo items, the login state is restored by
authenticating the session.

## License

[The Unlicense](https://opensource.org/licenses/unlicense)

## Credit

Created by [Jared Hanson](https://www.jaredhanson.me/)
Customized by Jonathan Rovner
