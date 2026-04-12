const express = require('express');
const app = express();
app.use(express.json());

// Datos falsos para la prueba
const mockTransactions = [
  { id: 1, amount: 150.00, description: 'Pago Internet', date: '2026-04-10' },
  { id: 2, amount: -20.50, description: 'Cafetería', date: '2026-04-11' },
  { id: 3, amount: 1200.00, description: 'Nómina', date: '2026-04-12' }
];

// Endpoint de prueba
app.get('/all', (req, res) => {
  console.log("Petición recibida en MS Transacciones");
  res.json({
    status: "success",
    data: mockTransactions
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`MS Transacciones (Modo Mock) en puerto ${PORT}`);
});