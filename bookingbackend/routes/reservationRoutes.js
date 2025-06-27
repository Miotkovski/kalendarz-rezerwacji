const express = require('express');
const router = express.Router();
const {
  createReservation,
  getReservations,
  deleteReservation,
  updateReservation
} = require('../controllers/reservationController');

router.post('/', createReservation);
router.get('/', getReservations);
router.delete('/:id', deleteReservation);
router.put('/:id', updateReservation);

module.exports = router;
