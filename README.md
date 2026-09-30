# Football Hub

Football Hub is a Spring Boot + React football project with a squad builder, squad battle and local football games.

## Main features

- Squad Builder with multiple formations
- Player search powered by TheSportsDB
- Team manager selection
- Daily random squad challenge message
- Export the tactical board as a PNG image
- Squad Battle with categories, random category selection, squad submission and voting
- Football Imposter pass-and-play game
- Football Alphabet timed footballer game

## Run the backend

Open a terminal in `footballhub`:

```bash
mvn spring-boot:run
```

The backend runs on `http://localhost:8080`.

The app uses MySQL database `footballhub`.

The default local database password is `FootballHub@2026`. For another password, set the `DB_PASSWORD` environment variable before starting Spring Boot.

## Run the frontend

Open another terminal in `footballhub-frontend`:

```bash
npm install
npm run dev
```

Then open the Vite URL, normally `http://localhost:5173`.

## Player API

Player searches use TheSportsDB V1's player search endpoint. The project uses the free public key `3` through:

`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php`

TheSportsDB's V1 API documentation describes `searchplayers.php?p=...` as its player-name search endpoint.

## Pitch image

The Squad Builder uses a top-down football-pitch image as the board background rather than drawing the pitch with CSS. The image is loaded from the web, so an internet connection is needed for that background.


## Pitch image
The squad builder uses the Wikimedia Commons “Soccer Field Transparant.svg” as the pitch artwork. It is licensed CC BY-SA; attribution/source is kept here for the school project.
Source: https://commons.wikimedia.org/wiki/File:Soccer_Field_Transparant.svg

## Player data
Player search is handled by TheSportsDB V1 `searchplayers.php` endpoint through the Spring Boot backend. The free V1 API uses the numeric key in the URL and has rate limits, so avoid sending many searches repeatedly.
