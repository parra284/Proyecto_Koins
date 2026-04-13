require('dotenv').config();
const express = require('express');
const client = require('prom-client');
const register = new client.Registry();
client.collectDefaultMetrics({ register });
const app = express();
app.use(express.json());

// Inyeccion de dependencia
const UserRepository = require('./repositories/SupabaseUserRepository');
const userRepo = new UserRepository();

// Métrica para contar peticiones (Sirve para ver el tráfico en Grafana)
const httpRequestsCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP recibidas',
  labelNames: ['method', 'route', 'status']
});
register.registerMetric(httpRequestsCounter);

// Middleware para registrar cada llamada automáticamente
app.use((req, res, next) => {
  // 1. Filtro de seguridad (lo que hablamos antes)
  const ignorablePaths = ['/metrics', '/favicon.ico'];
  if (ignorablePaths.includes(req.path)) return next();

  res.on('finish', () => {
    // 2. Intentamos obtener el patrón de la ruta (ej: /validate/:id)
    // Si la ruta no existe (404), usamos req.path para saber qué intentaron buscar
    const route = req.route ? req.route.path : req.path;

    httpRequestsCounter.inc({ 
      method: req.method, 
      route: route, // <--- AQUÍ está el truco
      status: res.statusCode 
    });
  });
  next();
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await userRepo.login(email, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

app.get('/validate/:id', async (req, res) => {
    try {
        const user = await userRepo.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ 
                exists: false, 
                message: "El usuario no existe en el sistema" 
            });
        }

        // Devolvemos solo lo necesario para el intercambio de información
        res.json({ 
            exists: true, 
            userId: user.id,
            status: user.status || 'active', // Útil para lógica de negocio
            full_name: user.full_name
        });
    } catch (error) {
        res.status(500).json({ error: "Error interno al validar usuario" });
    }
});

// Endpoint para que Prometheus recoja los datos
app.get('/metrics', async (req, res) => {
  try {
    const data = await register.metrics();
    res.set('Content-Type', register.contentType);
    res.send(data); // .send maneja mejor los buffers que .end
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`MS Usuarios corriendo en puerto ${PORT}`);
});