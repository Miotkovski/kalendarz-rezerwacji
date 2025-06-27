-- Tworzenie tabeli, jeśli jeszcze nie istnieje 
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  date_time TIMESTAMP NOT NULL,
  note TEXT
);


INSERT INTO reservations (full_name, email, date_time, note) VALUES
('Anna Kowalska', 'anna@example.com', '2025-06-26 10:00:00', 'Notatka testowa'),
('Jan Nowak', 'jan@example.com', '2025-06-26 11:00:00', ''),
('Karol Malec', 'karol@example.com', '2025-06-26 13:00:00', 'Zajęte przez backend testowy');
