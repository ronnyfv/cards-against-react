import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import socketIo from "socket.io";

import { isDevelopment } from "./settings";
import { CardDatabase } from "./model/cards";
import { Application } from "./model/app";
import { Client } from "./model/client";

//
// ─── SETUP ──────────────────────────────────────────────────────────────────────
//

const app = express();
const server = new http.Server(app);
const io = socketIo(server);

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
// ─── SERVICES ────────────────────────────────────────────────────────────────────
//

const cards = new CardDatabase();
const setsPath = path.join(global.appRoot, 'data', 'sets');

for (const file of fs.readdirSync(setsPath)) {
  const setId = path.parse(file).name;
  const setPath = path.join(setsPath, file);
  cards.addSet(setId, JSON.parse(fs.readFileSync(setPath, 'utf-8')));
}

const cardsApp = new Application(cards);

// ────────────────────────────────────────────────────────────────────────────────


//
// ─── SOCKET ────────────────────────────────────────────────────────────────────
//

io.on('connection', (socket) => new Client(socket, cardsApp));

// ────────────────────────────────────────────────────────────────────────────────


//
// ─── STARTUP ────────────────────────────────────────────────────────────────────
//

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Started http server on ${port}`);
});

// ────────────────────────────────────────────────────────────────────────────────