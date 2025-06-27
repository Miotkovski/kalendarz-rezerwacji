const pool = require('../db');

const createReservation = async (req, res) => {
  const { full_name, email, date_time, end_time, note } = req.body;

  try {
    // sprawdzanie konfliktu (czy rezerwacja nachodzi na istniejącą)
    const check = await pool.query(
      `SELECT * FROM reservations 
       WHERE ($1, $2) OVERLAPS (date_time, end_time)`,
      [date_time, end_time]
    );

    if (check.rows.length > 0) {
      return res.status(409).json({ error: 'Termin już zajęty' });
    }

    const result = await pool.query(
      `INSERT INTO reservations (full_name, email, date_time, end_time, note) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [full_name, email, date_time, end_time, note]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Błąd przy tworzeniu rezerwacji:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

const getReservations = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM reservations ORDER BY date_time ASC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Błąd przy pobieraniu rezerwacji:', error);
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu rezerwacji' });
  }
};

const deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM reservations WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Rezerwacja nie istnieje' });
    }

    res.status(200).json({ message: 'Rezerwacja została usunięta' });
  } catch (error) {
    console.error('Błąd przy usuwaniu rezerwacji:', error);
    res.status(500).json({ error: 'Błąd serwera przy usuwaniu rezerwacji' });
  }
};

const updateReservation = async (req, res) => {
  const { id } = req.params;
  const { full_name, email, date_time, end_time, note } = req.body;

  try {
    const result = await pool.query(
      `UPDATE reservations
       SET full_name = $1, email = $2, date_time = $3, end_time = $4, note = $5
       WHERE id = $6
       RETURNING *`,
      [full_name, email, date_time, end_time, note, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Rezerwacja nie istnieje' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Błąd przy edytowaniu rezerwacji:', error);
    res.status(500).json({ error: 'Błąd serwera przy edytowaniu rezerwacji' });
  }
};

module.exports = {
  createReservation,
  getReservations,
  deleteReservation,
  updateReservation
};
