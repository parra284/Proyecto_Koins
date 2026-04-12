const express = require('express');
const app = express();
app.use(express.json());

// Base de datos temporal
let transactions = [];

app.post('/', (req, res) => {
  const { monto } = req.body;
  const userId = req.headers['x-user-id']; // Obtenido del Gateway

  if (!monto) return res.status(400).json({ error: 'Monto requerido' });

  const nuevaTransaccion = {
    id_transaccion: transactions.length + 1,
    monto: monto,
    fecha: new Date().toISOString(),
    id_user: userId // ID que viene de Supabase a través del Gateway
  };

  transactions.push(nuevaTransaccion);
  
  console.log('Nueva transacción guardada:', nuevaTransaccion);
  res.status(201).json(nuevaTransaccion);
});

// Ruta para ver las transacciones
app.get('/', (req, res) => {
    res.json(transactions);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`MS Transacciones (Modo Mock) en puerto ${PORT}`);
});