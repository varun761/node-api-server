# REST API server
[![CodeFactor](https://www.codefactor.io/repository/github/varun761/node-api-server/badge)](https://www.codefactor.io/repository/github/varun761/node-api-server)

Example of restfull API server with jwt authetication

# Requirement
Please define the following in the .env file
```sh
PORT=
MONGODB_URL=
JWT_ISSUER=
JWT_CONSUMER=
JWT_SECRET=
JWT_REFRESH_SECRET=
FRONTEND_URL=
MODE=
REDIS_URL=
```

# Run the project
To run the project
1. Install the package by run the following command
`npm run install-dep`
2. Run project in production mode
`npm start`
3. Run project in development mode
`npm run start-dev`

# Testing
Run the command
`npm run test`
If you found any issue on test, please report in issue section.
