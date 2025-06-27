-- Usunięcie starej tabeli, jeśli istnieje
DROP TABLE IF EXISTS reservations;

-- Tworzenie tabeli
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  date_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  note TEXT
);

-- Przykładowe rezerwacje

INSERT INTO reservations (full_name, email, date_time, end_time, note) VALUES
-- Niedziela 30.06
('Anna Kowalska', 'anna@example.com', '2025-06-30 09:00:00', '2025-06-30 10:00:00', 'Pierwsza rezerwacja'),
('Jan Nowak', 'jan@example.com', '2025-06-30 12:00:00', '2025-06-30 13:30:00', 'Konsultacja'),

-- Poniedziałek 01.07
('Maria Zielińska', 'maria@example.com', '2025-07-01 08:30:00', '2025-07-01 09:30:00', ''),
('Tomasz Wiśniewski', 'tomasz@example.com', '2025-07-01 11:00:00', '2025-07-01 12:00:00', 'Wizyta'),
('Katarzyna Maj', 'kasia@example.com', '2025-07-01 14:00:00', '2025-07-01 15:30:00', ''),

-- Wtorek 02.07
('Paweł Król', 'pawel@example.com', '2025-07-02 09:00:00', '2025-07-02 10:30:00', ''),
('Alicja Bąk', 'alicja@example.com', '2025-07-02 13:00:00', '2025-07-02 14:00:00', ''),

-- Środa 03.07
('Robert Lis', 'robert@example.com', '2025-07-03 10:00:00', '2025-07-03 11:30:00', ''),
('Magdalena Kot', 'magda@example.com', '2025-07-03 15:00:00', '2025-07-03 16:00:00', 'Spotkanie'),

-- Czwartek 04.07
('Ewa Dąbrowska', 'ewa@example.com', '2025-07-04 08:00:00', '2025-07-04 09:00:00', ''),
('Grzegorz Wójcik', 'grzesiek@example.com', '2025-07-04 12:00:00', '2025-07-04 13:00:00', ''),
('Natalia Kaczmarek', 'natalia@example.com', '2025-07-04 14:00:00', '2025-07-04 15:00:00', '');
