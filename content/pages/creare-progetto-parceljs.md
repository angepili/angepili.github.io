---
title: "Creare un progetto Parcel.js"
date: 2020-07-03T22:57:46+02:00
draft: false
image: '/uploads/parcel-js/parcel-js.png'
type : 'pages'
tags : [
    "Parcel.js",
    "Javascript"
]
categories : [
    "Development"
]
summary : "Parcel.js è un semplice bundler, ma anche molto completo. Vediamo come è semplice per uno sviluppatore, creare un piccolo progetto di partenza che compili ES6 a Javascript compatibile e ci permetta di scrivere Scss, poi compilato in Css"
---

## Che cos'è Parcel.js
[Parcel.js](https://parceljs.org/) è un bundler che supporta nativamente Javascript, Css, Html ed addirittura Typescript, livereload del browser, code-splitting e dot env.
A differenza di *webpack*, parte di default con già tutte queste funzionalità senza alcun bisogno di configurazioni, ed in più se questo non bastasse supporta una gran quantità di [plugin](https://www.npmjs.com/search?q=parcel-plugin*). 

## Inizializzare un progetto con Parcel.js

Iniziamo a creare un semplice progetto Parcel, apriamo il terminale:
```shell
cd ~
mkdir parceljs && cd $_
npm init -y
npm i -g parcel-bundler
```

Ora dentro la nostra cartella `parceljs` dovremmo avere una struttura di base simile a questa:
```
📦parceljs
 ┣ 📂node_modules
 ┗ 📜package.json
```

Passiamo quindi a creare i nostri file
```shell
touch index.html index.js index.scss
```

Come pure esercizio, nel file index.html inseriamo questo markup di base: un heading, ed i riferimenti all'asset javascript che abbiamo chiamato `index.js`.
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="./index.css" type="text/css" rel="stylesheet" />
</head>
<body>
    <h1>My Page</h1>
    <script src="./index.js"></script>
</body>
</html>
```

Abbiamo a disposizione due modalità con cui avviare Parcel: una modalità sviluppo, ed una modalità per buildare i file per l'ambiente di produzione.

Quindi lanciando da terminale `parcel index.html` verrà creato un server locale all'indirizzo http://localhost:1234; aggiungendo `--open` a seguire, ci verrà aperto direttamente il nostro browser di default.
Col server in esecuzione, ovviamente il processo non si arresta, e lavorerà in modaltà livereload: ovvero sarà in ascolto di qualsiasi modifica avvenga al CSS e JS, ed aggiornerà automaticamente la pagina aperta sul nostro browser.

Invece per eseguire la build per produzione, possiamo lanciamo il comando:
```shell
parcel build index.html
```
Verrà creata in automatico una cartella dist, contenente gli asset js e css compilati, rinominati per evitare problemi di caching, e l'index.html minificato e con i riferimenti agli asset già aggiornati. Sul terminale, rispetto al comando che lancia il server locale, questo al contrario chiude il processo subito dopo aver eseguito i propri compiti.

Questo è quindi il comportamento di default, tutto viene compilato direttamente dentro /dist; vedremo successivamente come personalizzare questo aspetto.


## Parcel con ES6 e Typescript

Parcel.js funziona da transpiler ES6, quindi possiamo tranquillamente scrivere i nostri file nelle ultime versioni di javascrpt, per cui possiamo restare tranquilli sulla compatibilità su i browser.

## Usare i dotenv con Parcel.js

Parcel mette a disposizione la possibilità di lavorare con i file .env, così da proteggere variabili sensibili e di ambiente.
Basta creare un file .env con dentro i valori che ci servono, ad esempio:
```dotenv
APP_KEY=012345
APP_SECRET=abcdefghi
```
E sul nostro javascript possiamo ottenere i relativi valori in questo modo, utilizzando `process.env`:
```javascript
const key = process.env.APP_KEY
const secret = process.env.APP_SECRET
```

Avviando quindi un server di sviluppo, potremmo gestire in tutta sicurezza le variabili di ambiente.


Qui il repository Github completo del post [https://github.com/angepili/parcel.js-scaffolding](https://github.com/angepili/parcel.js-scaffolding)