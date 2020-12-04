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
npm i --save-dev parcel
```

Ora dentro la nostra cartella `parceljs` dovremmo avere una struttura di base simile a questa:
```
📦parceljs
 ┣ 📂node_modules
 ┣ 📜package-lock.json
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
    <link href="./index.scss" type="text/css" rel="stylesheet" />
</head>
<body>
    <h1>My Page</h1>
    <script src="./index.js"></script>
</body>
</html>
```

Abbiamo a disposizione due modalità con cui avviare Parcel: una modalità sviluppo, ed una modalità per buildare i file per l'ambiente di produzione.

Quindi lanciando da terminale `npx parcel index.html` verrà creato un server locale all'indirizzo http://localhost:1234; aggiungendo `--open` a seguire, ci verrà aperto direttamente il nostro browser di default.
Col server in esecuzione, ovviamente il processo non si arresta, e lavorerà in modaltà livereload: ovvero sarà in ascolto di qualsiasi modifica avvenga al CSS e JS, ed aggiornerà automaticamente la pagina aperta sul nostro browser.

Invece per eseguire la build per produzione, possiamo lanciamo il comando:
```shell
npx parcel build index.html
```
Verrà creata in automatico una cartella dist, contenente gli asset js e css compilati, rinominati per evitare problemi di caching, e l'index.html minificato e con i riferimenti agli asset già aggiornati. Sul terminale, rispetto al comando che lancia il server locale, questo al contrario chiude il processo subito dopo aver eseguito i propri compiti.

Questo è quindi il comportamento di default, tutto viene compilato direttamente dentro /dist; vedremo successivamente come personalizzare questo aspetto.

## Parcel con ES6 e Typescript

Parcel.js funziona da transpiler ES6, quindi possiamo tranquillamente scrivere i nostri file nelle ultime versioni di javascrpt, per cui possiamo restare tranquilli sulla compatibilità su i browser.

Quindi per utilizzare typscript basterà usare i file `.tsx` e cambiare la reference sull'index.html con l'estensione `tsx`.
```html
<script src="./index.tsx"></script>
```

## Usare React con Parcel.js
Utilizzare react con Parcel è molto semplice, sostanzialmente basta installare il pacchetto npm, inizializzare il nostro index.tsx ed il gioco è fatto:
```shell
npm i --save react react-dom
```
```ts
// index.tsx

import React from 'react';
import ReactDom from 'react-dom';

const App = () => <div>Hello world!</div>

ReactDom.render(
    <App />,
    document.getElementById('root')
);
```
```html
// index.html
...
<body>
    <div id="root"></div>
    <script src="./index.tx"></script>
</body>
...
```

## Usare i dotenv con Parcel.js

Parcel mette a disposizione la possibilità di lavorare con i file .env, così da proteggere variabili sensibili e di ambiente.
Basta creare un file .env con dentro i valori che ci servono, ad esempio:
```shell
APP_KEY=012345
APP_SECRET=abcdefghi
```
E sul nostro javascript possiamo ottenere i relativi valori in questo modo, utilizzando `process.env`:
```javascript
const key = process.env.APP_KEY
const secret = process.env.APP_SECRET
```

Avviando quindi un server di sviluppo, potremmo gestire in tutta sicurezza le variabili di ambiente.

## Come configurare Parcel
Parcel è un bundler zero-config, vero. Comodo sicuramente per sviluppi veloci o di test.
In realtà abbiamo un pò di possibilità di personalizzare il nostro setup.

Di default Parcel builda i file sulla cartella `dist`; possiamo cambiare questo aspetto utilizzando il paremtro con `--out-dir`:
```shell
npx parcel index.html --out-dir /mio/nuovo/percorso/
```

Personalizzare la porta, che di default è 1234
```shell
npx parcel index.html --port 9000 --open
```

Cambiare la path degli asset, che di default è `./`
```shell
npx parcel index.html --public-url ./nuova/path
```

Il nome del virtual host
```shell
npx parcel index.html --host dev.local.host
```

Ci sono tante personalizzazione, [sulla pagina dedicata di parcel](https://parceljs.org/cli.html) sono indicate tutte le restanti.