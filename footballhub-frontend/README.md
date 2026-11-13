# Football Hub Frontend

This is the React side of Football Hub. It contains the pages, squad builder and football games that people use on the website.

The backend is in the `footballhub` folder. It handles the API and connects to the database.

## Run the frontend

Make sure the backend is running first. Then open a terminal in this folder and run:

```bash
npm install
npm run dev
```

Vite normally opens the website at `http://localhost:5173`.

When running in development, the frontend connects to the backend at `http://localhost:8080/api`. If your backend is running at a different address, create a `.env.local` file in this folder and add:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Use your actual backend address if it is not running on your computer.

## Build the frontend

To check that the production build works, run:

```bash
npm run build
```

The finished files are placed in the `dist` folder. Vercel uses this build when the site is deployed.
