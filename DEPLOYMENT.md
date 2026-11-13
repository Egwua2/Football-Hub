# Putting Football Hub Online

These are the steps for deploying the project. The frontend and backend are hosted separately, and the backend connects to a managed MySQL database.

## 1. Database

Create a MySQL database with your database provider.

Keep these details somewhere safe:
- Database host
- Port
- Database name
- Username
- Password

You will need them when setting up the backend. Do not put the real password in this file or commit it to GitHub.

## 2. Backend on Render

The repository already has a `render.yaml` file for the backend.

1. Open the Render Dashboard.
2. Choose **New → Blueprint**.
3. Select this GitHub repository and the `main` branch.
4. Render reads `render.yaml` and sets up the `footballhub-api` service.
5. Add the database details as environment variables:

| Variable | Value |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://HOST:PORT/DATABASE?sslMode=REQUIRED&serverTimezone=UTC` |
| `SPRING_DATASOURCE_USERNAME` | Your database username |
| `SPRING_DATASOURCE_PASSWORD` | Your database password |

Replace the example parts of the database URL with the details from your provider.

6. Deploy the service and check that its health check passes.

The health endpoint is:

`https://YOUR-RENDER-SERVICE.onrender.com/api/health`

It should return a response showing that the API is running.

## 3. Frontend on Vercel

The Vercel project is connected to this GitHub repository. These are the frontend build settings:

- Root directory: `footballhub-frontend`
- Framework: Vite
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`

In the Vercel project settings, add this environment variable:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://YOUR-RENDER-SERVICE.onrender.com/api` |

The URL must end with `/api`. Save the change and redeploy the frontend so it uses the correct backend address.

## 4. Test the website

After both parts are deployed, check the main features:

1. Open the website.
2. Create an account or log in.
3. Search for a player and create a squad.
4. Add players and a manager, then export the squad image.
5. Open Squad Battle and test creating and joining a room from two browsers or devices.
6. Try Football Imposter, Football Alphabet and Football Who Am I.
7. Check the browser console if something is not loading or an API request fails.

## Things to remember

- Do not use `localhost` as the API address on the live website.
- Keep database passwords in Render environment variables, not in the code.
- Use a separate database for testing and previews. Do not connect test deployments to the live database.
- The backend needs a working database connection before the website's account and squad features can work.
