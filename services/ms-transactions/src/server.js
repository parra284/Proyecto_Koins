const express = require('express');
const axios = require('axios'); // Librería para comunicación REST
const axiosRetry = require('axios-retry').default;
const app = express();
app.use(express.json());

let transactions = [];

// Configuración de reintentos
axiosRetry(axios, { 
    retries: 3, 
    shouldResetTimeout: true, 
    retryDelay: (retryCount) => {
        console.log(`⚠️ Fallo detectado. Intento de recuperación #${retryCount}...`);
        return 2000;
    },
    retryCondition: (error) => {
        // Reintenta si no hay respuesta del servidor (servidor apagado) o errores 5xx
        return !error.response || error.response.status >= 500;
    }
});

// Configuración de la URL del microservicio de Usuarios
// En entornos reales, esto iría en un archivo .env
// Agrega un valor por defecto si process.env.USUARIOS_MS_URL es undefined
const USUARIOS_MS_URL = process.env.USUARIOS_MS_URL || 'http://localhost:3002';

app.post('/', async (req, res) => {
  const { monto } = req.body;
  const userId = req.headers['x-user-id']; 

  if (!monto) return res.status(400).json({ error: 'Monto requerido' });
  if (!userId) return res.status(401).json({ error: 'Usuario no identificado' });

  try {
    // LLAMADA CON TIMEOUT (Primera capa de resiliencia)
    const response = await axios.get(`${USUARIOS_MS_URL}/validate/${userId}`, {
      timeout: 2000 // Si el MS Usuarios no responde en 2s, se dispara el error y entra el Retry
    });

    const { exists, status } = response.data;

    if (exists && status === 'active') {
      const nuevaTransaccion = {
        id_transaccion: transactions.length + 1,
        monto: monto,
        fecha: new Date().toISOString(),
        id_user: userId 
      };

      transactions.push(nuevaTransaccion);
      res.status(201).json(nuevaTransaccion);
    } else {
      res.status(403).json({ error: 'El usuario no está autorizado' });
    }

  } catch (error) {
    // --- MANEJO DE FALLOS FINAL (Punto de Resiliencia) ---
    console.error('La comunicación falló tras los reintentos:', error.message);
    
    // Aquí podrías implementar un FALLBACK real si el negocio lo permite:
    // Por ejemplo: Guardar la transacción con un flag "pendiente_de_validar" 
    // en lugar de simplemente dar un error 503.
    
    res.status(503).json({ 
      error: 'Servicio de validación no disponible', 
      detail: 'Se intentó conectar con el servicio de usuarios 3 veces sin éxito.' 
    });
  }
});

app.get('/', async (req, res) => {
  try {
    const transaccionesEnriquecidas = await Promise.all(
      transactions.map(async (t) => {
        try {
          // Intentamos obtener el nombre (con un timeout corto para no ralentizar)
          const resUser = await axios.get(`${USUARIOS_MS_URL}/validate/${t.id_user}`, { 
            timeout: 1000 
          });
          return { ...t, nombre_usuario: resUser.data.full_name };
        } catch (e) {
          // PATRÓN FALLBACK: Si falla, no rompemos el GET, devolvemos un valor seguro
          return { ...t, nombre_usuario: "Nombre no disponible" };
        }
      })
    );
    res.json(transaccionesEnriquecidas);
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor de transacciones" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`MS Transacciones (Evolucionado) en puerto ${PORT}`);
});