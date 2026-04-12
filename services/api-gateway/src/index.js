const express = require('express');
const proxy = require('express-http-proxy');
const { createRemoteJWKSet, jwtVerify } = require('jose');
require('dotenv').config();

const app = express();

// Configuración de Supabase
const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL;
const SUPABASE_JWT_ISSUER = `${SUPABASE_PROJECT_URL}/auth/v1`;
const JWKS_URL = new URL(`${SUPABASE_JWT_ISSUER}/.well-known/jwks.json`);

const SUPABASE_JWT_KEYS = createRemoteJWKSet(JWKS_URL);

// --- Middleware de Autenticación ---
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No se proporcionó un token de acceso' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificamos el token con las llaves remotas de Supabase
    const { payload } = await jwtVerify(token, SUPABASE_JWT_KEYS, {
      issuer: SUPABASE_JWT_ISSUER,
    });

    // Guardamos la info del usuario (sub, email, etc) en el objeto req
    // para que el proxy o los servicios puedan usarla si es necesario
    req.user = payload;
    
    next(); // Continuar al microservicio
  } catch (error) {
    console.error('Error verificando JWT:', error.message);
    return res.status(401).json({ error: 'Token inválido o expirado' });
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

app.use('/users', authMiddleware, proxy(process.env.USERS_SERVICE_URL));

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