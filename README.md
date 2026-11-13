# Football Hub

Football Hub is a football project I built to bring a few football games and squad features together in one place.

You can build your own team, put it up against other squads, and play some football guessing games with friends.

## What you can do on the website

- **Squad Builder:** Pick a formation, search for players, choose a manager and build your starting XI. You can also save the pitch as an image.
- **Squad Battle:** Create or join a room, submit your squad and vote on the teams.
- **Football Imposter:** Play a group guessing game and try to find the imposter.
- **Football Alphabet:** Race against the clock to name footballers for the letters.
- **Football Who Am I:** Each player gets a mystery footballer to identify. Wrong guesses earn yellow and red cards. You can play Classic Mode or the 3-Minute Timer mode.
- **Daily Squad Challenge:** Get a different squad challenge on the home page.

Player search uses TheSportsDB.

## What I used to build it

- React and Vite for the frontend
- Java and Spring Boot for the backend
- MySQL for the database
- React Router for moving between pages
- Lucide React for the icons
- TheSportsDB for player search

## Run it on your computer

You need Java, Maven, Node.js, npm and MySQL installed.

### 1. Set up the database

Create a MySQL database called `footballhub`.

The backend connects to `localhost:3306/footballhub` by default and uses `root` as the default username. Set your own database password with the `SPRING_DATASOURCE_PASSWORD` environment variable before starting the backend.

### 2. Start the backend

Open a terminal in the `footballhub` folder and run:

```bash
mvn spring-boot:run
```

The backend normally runs at `http://localhost:8080`.

### 3. Start the frontend

Open another terminal in `footballhub-frontend` and run:

```bash
npm install
npm run dev
```

Vite normally opens the website at `http://localhost:5173`.

When running locally, the frontend looks for the backend at `http://localhost:8080/api`. For a deployed version, set `VITE_API_BASE_URL` to the backend URL ending in `/api`.

## Pitch image credit

The Squad Builder uses the “Soccer Field Transparant.svg” image from Wikimedia Commons.

Source: https://commons.wikimedia.org/wiki/File:Soccer_Field_Transparant.svg

## A note about player search

Player searches go through TheSportsDB's V1 player search endpoint. It is a free service, so avoid sending loads of repeated searches in a short time.
