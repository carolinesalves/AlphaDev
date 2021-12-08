//Install express server
const express = require('express');
const path = require('path');
const SessionController = require('./controller');
const cors = require('cors');


const app = express();

const corsOptions = {
    exposedHeaders: ['x-access-token']
};

app.use(cors(corsOptions))
app.use(express.json());
app.post('/auth',SessionController.store)


// Serve only the static files form the dist directory
app.use(express.static('./dist/loginCadastro'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/loginCadastro/'}),
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080, () => console.log('Servidor na 8080'));


// const server = express();

// const corsOptions = {
//     exposedHeaders: ['x-access-token']
// };

// server.listen(3000, ()=> console.log('Servidor rodando na porta 3000'))
// server.use(cors(corsOptions))
// server.use(express.json());
// app.post('/auth',SessionController.store)