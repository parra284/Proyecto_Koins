const express = require('express');
const axios = require('axios'); // Librería para comunicación REST
const app = express();
app.use(express.json());

let transactions = [];

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
    // --- PASO 1: Comunicación entre servicios (SOA) ---
    // El MS Transacciones (Consumidor) consulta al MS Usuarios (Proveedor)
    const response = await axios.get(`${USUARIOS_MS_URL}/validate/${userId}`, {
      timeout: 2000 // Mecanismo de Resiliencia: Timeout de 2 segundos [cite: 37]
    });

    const { exists, status } = response.data;

    console.log(exists);
    

    // --- PASO 2: Lógica basada en el intercambio de información ---
    if (exists && status === 'active') {
      const nuevaTransaccion = {
        id_transaccion: transactions.length + 1,
        monto: monto,
        fecha: new Date().toISOString(),
        id_user: userId 
      };

      transactions.push(nuevaTransaccion);
      
      console.log('Validación exitosa y transacción guardada:', nuevaTransaccion);
      res.status(201).json(nuevaTransaccion);
    } else {
      res.status(403).json({ error: 'El usuario no está autorizado para transaccionar' });
    }

  } catch (error) {
    // --- PASO 3: Manejo de fallos (Base para Resiliencia) ---
    console.error('Error en la comunicación entre servicios:', error.message);
    
    // Aquí puedes implementar un Fallback [cite: 38]
    // Por ahora, devolvemos un error controlado como pide el PDF [cite: 95]
    res.status(503).json({ 
      error: 'Servicio de validación no disponible', 
      detail: 'No se pudo verificar el estado del usuario' 
    });
  }
});

app.get('/', async (req, res) => {
  try {
    // Mapeamos las transacciones para enriquecerlas con datos de Usuarios
    const transaccionesEnriquecidas = await Promise.all(
      transactions.map(async (t) => {
        try {
          // Llamada REST al segundo microservicio
          const resUsuario = await axios.get(`${USUARIOS_MS_URL}/validate/${t.id_user}`, {
            timeout: 1500 // Patrón de Resiliencia: Timeout [cite: 37]
          });
          
          return {
            ...t,
            nombre_usuario: resUsuario.data.full_name || 'Usuario Verificado' // Intercambio de info 
          };
        } catch (error) {
          // Fallback en caso de que el MS Usuarios no responda [cite: 38]
          return {
            ...t,
            nombre_usuario: "Nombre no disponible (Offline)"
          };
        }
      })
    );

    res.json(transaccionesEnriquecidas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el historial enriquecido" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`MS Transacciones (Evolucionado) en puerto ${PORT}`);
});