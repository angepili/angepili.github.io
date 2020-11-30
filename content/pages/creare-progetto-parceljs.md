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

Iniziamo a creare un semplice progetto Parcel, apriamo il terminale:
```shell
cd ~
mkdir parceljs && cd $_
npm init
```

Ora dentro la nostra cartella `parceljs` creiamo questa struttura con i relativi file javascript, html ed scss; il package.json dovrebbe essere già esistente poichè creato col comando `npm init`
```
📦parceljs
 ┣ 📂src
 ┃ ┣ 📂styles
 ┃ ┃ ┗ 📜main.scss
 ┃ ┣ 📜hello.js
 ┃ ┣ 📜index.html
 ┃ ┗ 📜index.js
 ┗ 📜package.json
```

Ora possiamo installare parcel.js, dalla root del progetto lanciamo:
```shell
npm i -D parcel-bundler
```

Basta, fin qui possiamo dire che sarebbe già tutto funzionante, infatti la struttura sulla quale lavoreremo "src" contiene tutti i file essenziali per lavorare in ambiente di sviluppo; successivamente vedremo come creare il pacchetto per produzione.

Apriamo il progetto dentro il nostro editor, se si usa Visual Studio Code, allora da terminale basterà digitare:
```shell
code .
```

Per far girare l'applicativo, dobbiamo indicare quali sono i comandi per far avviare il nostro server di sviluppo, ed il comando per buildare il pacchetto di produzione.

Quindi sul file `package.json` aggiungiamo queste due righe all'interno di **scripts**:
```yaml
    "dev": "parcel src/index.html",
    "prod": "parcel build src/index.html"
```

dovremmo ottenere qualcosa del genere:
```json
{
  "name": "parceltest",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "parcel src/index.html",
    "prod": "parcel build src/index.html"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "parcel-bundler": "^1.12.4",
    "sass": "^1.26.9"
  }
}
```

ed ora avviamo il server di sviluppo in live-reload:
```shell
npm run dev
```

Torniamo su VsCode, inseriamo nel file index.html un markup di base: un heading, ed i riferimenti all'asset javascript che abbiamo chiamato `index.js`.
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

</head>
<body>
    <h1>My Page</h1>
    <script src="./index.js"></script>
</body>
</html>
```

## Iniziamo a scrivere Javascript con Parcel.js

Bene fin qui abbiamo visto come configurare il bundler Parcel e inizializzare la struttura di un progetto.
Ora per testare che funzioni bene il transpiler di ES6, iniziamo a scrivere un pò di javascript sul file `hello.js` una semplice funzione che ha in ingresso un parametro, e restituisce Hello **parametro**:
```javascript
const title = (text) => {
    return `Hello ${text}!`
}

export { title }
```

Sul file `index.js` importiamo la function title
```javascript
import { title } from './hello';

document.querySelector('h1').textContent = title(`Angelo`);
```

Tornando al browser, e quindi alla pagina aperta in livereload, noteremo che il titolo non è più My Page, ma Hello Angelo!

Questo significa che il nostro ES6 sta venendo convertito in javascript compatibile, e il nostro browser riesce a leggerlo tranquillamente.

## Come usare SCSS con Parcel
Infine manca la parte del css, andiamo sul file `main.scss` ed aggiungiamo una semplice regola SCSS:
```scss
$red: #cc0000;

html {
    body {
        background: $red;
    }
}
```

Ora torniamo al file `index.js` ed importiamo il foglio di stile, aggiungendo questa riga subito in alto dove è già presente il primo import.
```javascript
import { title } from './hello';
import './styles/main.scss';
```

Il file è ora importato, e sulla pagina vedremo che il colore dello sfondo diverrà rosso.


## Buildare Parcel.js per produzione
Ovviamente il codice sviluppato fin qui non è pronto per la messa online, bisogna compilarlo, basterà lanciare:
```shell
npm run prod
```
Verrà creata la cartella **dist** contente i file javascript compressi e pronti per l'ambiente di produzione.

Qui il repository Github completo del post [https://github.com/angepili/parcel.js-scaffolding](https://github.com/angepili/parcel.js-scaffolding)