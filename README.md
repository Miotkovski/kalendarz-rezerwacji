# Kalendarz Rezerwacji

Projekt aplikacji webowej umożliwiającej zarządzanie rezerwacjami w widoku kalendarza tygodniowego. 
Aplikacja pozwala na dodawanie, edytowanie i usuwanie rezerwacji z określonym zakresem godzinowym.

---

# Struktura projektu

├── backend/ → Express + PostgreSQL
├── frontend/ → React + FullCalendar
├── bookingdatabase/ → Plik SQL z bazą danych i przykładowymi danymi



 Wymagania

- Node.js (v18 lub nowszy)
- PostgreSQL (np. pgAdmin lub psql CLI)


Jak uruchomić lokalnie

### 1. Utwórz bazę danych

Utwórz lokalnie bazę danych o nazwie `booking`:

- przez pgAdmin: `Create > Database > booking`
- lub w terminalu:
 psql -U postgres -d booking -f bookingdatabase/init.sql   <- init.sql ma import bazy 

### 3. Backend – konfiguracja i uruchomienie
Plik .env (backend/.env)
Utwórz plik .env z taką zawartością:

DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=booking
DB_HOST=localhost
DB_PORT=5432
PORT=8080

Uruchom backend:

cd backend ->  tak żeby być w bookingbackend
npm install
npm start

### 4. Frontend – konfiguracja i uruchomienie
Plik .env (frontend/.env)

REACT_APP_API_URL=http://localhost:8080


# 5.Funkcje aplikacji
Rezerwacja przedziału czasowego (start – koniec)

Widok kalendarza tygodniowego (pon–pt)

Godziny pracy: 08:00 – 18:00

Edycja i usuwanie rezerwacji

Walidacja kolizji – nie można zarezerwować zajętego terminu

Obsługa błędów (np. błędne dane, serwer niedostępny)

Wstępnie załadowane przykładowe dane (30.06 – 04.07)


pliki .env są ignorowane w repozytorium (.gitignore) 


### Dawid Miotk 
77782
Programowanie 
przedmiot: Programowanie w językach skryptowych 
wykładowca: A. Wojtak

link do repozytorium https://github.com/Miotkovski/kalendarz-rezerwacji/tree/master