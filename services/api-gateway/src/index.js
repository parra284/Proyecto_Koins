const express = require('express');
const proxy = require('express-http-proxy');
const createVerifier = require('./auth-factory');
require('dotenv').config();

const app = express();

// Configuración de Supabase
const verifyJWT = createVerifier();

// --- Middleware de Autenticación ---
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No se proporcionó un token de acceso' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // La factory nos abstrae de la implementación
    const { payload } = await verifyJWT(token);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// --- Rutas Protegidas ---
// Aplicamos el middleware antes del proxy
app.use('/transactions', authMiddleware, proxy(process.env.TRANSACTIONS_SERVICE_URL, {
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // Opcional: Pasar el ID del usuario al microservicio mediante un header personalizado
    if (srcReq.user) {
      proxyReqOpts.headers['X-User-Id'] = srcReq.user.sub;
    }
    return proxyReqOpts;
  }
}));

app.use('/users', proxy(process.env.USERS_SERVICE_URL));

// Ruta de prueba rápida
app.get('/test-auth', authMiddleware, (req, res) => {
  res.json({
    message: "¡Middleware funcionando!",
    user: req.user // Aquí verás los datos que vienen de Supabase
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gateway corriendo en puerto ${PORT}`);
});