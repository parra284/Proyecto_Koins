const express = require('express');
const proxy = require('express-http-proxy');
const app = express();
require('dotenv').config();

// Microservicios
app.use('/transactions', proxy(process.env.TRANSACTIONS_SERVICE_URL));
app.use('/users', proxy(process.env.USERS_SERVICE_URL));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gateway corriendo en puerto ${PORT}`);
});