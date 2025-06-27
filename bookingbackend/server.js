require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api/reservations', reservationRoutes);

app.get('/', (req, res) => {
  res.send('Serwer działa!');
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Nie znaleziono zasobu' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Błąd serwera' });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
