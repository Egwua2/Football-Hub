# Football Hub deployment

## Hosting layout

- Frontend: Vercel (Vite project in `footballhub-frontend`)
- API: Render Web Service (Docker, Spring Boot)
- Database: Managed MySQL. This project remains on MySQL.

## 1. Create a MySQL database

The current backend uses MySQL. Render's free plan does not include private services or persistent disks, so this Blueprint expects an external managed MySQL database.

For a small student/demo deployment, Aiven currently offers a free MySQL plan with 1 GB storage and 1 GB RAM. The free tier can be powered off after extended inactivity. Check the provider's current limits before relying on it for a live demo.

Create a MySQL service in Aiven and note its host, port, database name, username, and password. Do not commit these values to GitHub or paste passwords into chat.

## 2. Create the Render API

1. Open the Render Dashboard.
2. Choose **New → Blueprint**.
3. Select `Egwua2/Football-Hub` and branch `main`.
4. Render reads the root-level `render.yaml` and creates `footballhub-api`.
5. When prompted, set these environment variables using your managed MySQL connection details:
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://YOUR_HOST:YOUR_PORT/YOUR_DATABASE?sslMode=REQUIRED&serverTimezone=UTC`
   - `SPRING_DATASOURCE_USERNAME`: the database username
   - `SPRING_DATASOURCE_PASSWORD`: the database password
6. Deploy the Blueprint. Wait for the service health check to pass.

The API health endpoint is `https://YOUR-RENDER-SERVICE.onrender.com/api/health`. It should return JSON with `"status":"ok"`.

Render's Free web service sleeps after inactivity. The first request after sleeping may take a while to respond.

## 3. Connect Vercel to the API

The Vercel project is already connected to this GitHub repository. Its root directory is set to `footballhub-frontend`, with:
- Framework: Vite
- Install: `npm ci`
- Build: `npm run build`
- Output: `dist`

In Vercel → Project → Settings → Environment Variables, add:

- Key: `VITE_API_BASE_URL`
- Value: `https://YOUR-RENDER-SERVICE.onrender.com/api`
- Environments: Production, Preview, Development (select at least Production)

Save and redeploy the Vercel project. The value must end with `/api`.

## 4. Smoke test

1. Open the Vercel production URL.
2. Sign up or log in.
3. Search for a player and create a squad.
4. Export the squad image.
5. Create and join a Squad Battle room in two browser profiles/devices.
6. Confirm the browser console has no CORS or failed API requests.

## Notes

- Never use `localhost` in the production `VITE_API_BASE_URL`.
- Keep database credentials only in Render environment variables.
- The old default MySQL password was removed from the source configuration. If it was reused outside your local computer, rotate it because it was previously committed to a public repository.
