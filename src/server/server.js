import express from "express";
import http from "http";

import { isDevelopment } from "./settings";

//
// ─── SETUP ──────────────────────────────────────────────────────────────────────
//

const app = express();
const server = new http.Server(app);


// ────────────────────────────────────────────────────────────────────────────────


//
// ─── CONSIGURATION ──────────────────────────────────────────────────────────────
//

app.set('view engine', 'hbs');
app.use(express.static('public'));

const useExternalStyles = !isDevelopment;
const scriptRoot = isDevelopment ? 'http://localhost:8080/build' : '/build';

// ────────────────────────────────────────────────────────────────────────────────


//
// ─── ROUTES ─────────────────────────────────────────────────────────────────────
//

app.get('*', (req, res) => {
  res.render('index', {
    useExternalStyles,
    scriptRoot
  });
});

// ────────────────────────────────────────────────────────────────────────────────


//
// ─── STARTUP ────────────────────────────────────────────────────────────────────
//

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Started http server on ${port}`);
});

// ────────────────────────────────────────────────────────────────────────────────