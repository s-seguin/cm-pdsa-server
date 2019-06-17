# cm-pdsa-server

CM PDSA - Admin Panel Server

## Getting Started

#### Clone this repository

```bash
git clone ssh://git@bitbucket.criticalmass.com:7999/cip/cm-pdsa-server.git
```

## Branching Strategy

All development work should be done on your own branch.

1. Cut a `feature` or `bugfix` branch off of develop

2. Create a pull request to merge your feature back into develop.

3. Pull requests will be reviewed by two mentors, then merged back into develop.

## Server Info

Entry point for this application is `index.js`, as we are using ESM to provide ES6 compatibility.

Routes should be kept clean and all logic should reside in a controller.

Database connects to local `test` MongoDB via Mongoose, connection is opened upon server initialization. This will need to be changed for Production.

## Running

1. `npm i` to install all dependencies.
2. `npm start` to start server using `nodemon`.
