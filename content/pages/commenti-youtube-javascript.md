---
title: "Ottenere i commenti Youtube tramite API con Javascript"
date: 2020-08-21T18:49:16+02:00
draft: false
author : "Angelo"
image : "/uploads/youtube-comments-javascript/youtube-commenti-javascript.png"
type : 'pages'
tags : [
    "Youtube",
    "API",
    "Javascript"
]
categories : [
    "Development"
]
summary : "Attraverso le API di youtube viste nel precedente articolo, con Javascript proveremo ad eseguire questa chiamata direttamente dal browser: dall'API otterremo la risposta con i commenti di Youtube in formato JSON, e proveremo ad impaginarli in un widget Html"
---

Nel precedente post [Ottenere i commenti di un video Youtube tramite API](/pages/ottenere-commenti-video-youtube/) abbiamo visto come consumare le API di youtube attraverso Postman. In questo nuovo post vediamo come sviluppare via Javascript un applicazione che ottenga i commenti Youtube in formato Json e li impagini in un widget Html.

Per comodità possiamo inizializzare il progetto utilizzando lo scaffolding del [bundler Parcel](/pages/creare-progetto-parceljs/) già visto in un precendete articolo.

Abbiamo bisogno prima di tutto dell'API key; la possiamo creare utilizzando la [console di Google](https://console.developers.google.com/), andando poi in fase di configurazione ad abilitare il servizio Youtube.

Prima di tutto nel nostro codice html occorre indicare quale sarà il wrapper, un semplice elemento div vuoto con id *comments*
```html
<div id="comments"></div>
```

Sul nostro Javascript andiamo a dichiarare le uniche due variabili che ci occorrono, le API key e l'elemento html che andrà a contenere tutti i commenti Youtube:
```javascript
const api_key = '1234567890xxxxxx' // usa process.env.API_KEY se stai usando il .env con il parametro API_KEY, altrimenti dichiara il valore direttamente.
const container = document.getElementById('comments');
```

La prima funzione necessaria, è quella che va a fare la chiamata GET alle **API di Youtube** all'endpoint *https://www.googleapis.com/youtube/v3/commentThreads* insieme ad i parametri:
- *videoId*: l'id del video Youtube da cui andremmo a prelevare i commenti
- *part*: indichiamo quali contenuti richiedere nel contenuto della risposta Json
- *maxResult*: il massimo di commenti che intendiamo ricevere
- *key*: la nostra chiave Google

Quindi andiamo a scrivere la nostra funzione asincrona in javascript, il cui solo parametro in entrata è l'id del video youtube:
```javascript
const getComments = async (videoId) => {
    let response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?videoId=${videoId}&part=snippet,replies&maxResults=100&key=${api_key}`);
    let data = await response.json()
    return data;
}
```

## Come creare un template html per i commenti Youtube con Javascript

Come già detto, la risposta dell'API youtube è un oggetto Json, i cui commenti sono dentro la chiave *items*, e debbono essere ovviamente iterati: ad ogni iterazione avremmo a disposizione il commento, che dobbiamo stampare in un template html. 

Per fare questo la via più semplice e riusabile è utilizzare una funzione: ricevo il parametro che contiene il commento youtube e lo stampo.
Ho immaginato il template con una struttura abbastanza classica: avatar e nickname dell'utente linkati al canale, testo del commento al video, data di pubblicazione e quanti like ha ricevuto il video Youtube. Utilizziamo la sintassi javascript con i backtick e template literals.
```javascript
const commentTemplate = item => {
    const { id, snippet } = item; // estraggo le variabili 
    const { textDisplay, authorDisplayName, authorProfileImageUrl, authorChannelUrl, likeCount, publishedAt} = snippet.topLevelComment.snippet; // estraggo le variabili del commento
    const date = new Date(publishedAt); // inizializzo la data di pubblicazione
    let datePublished = `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}` // creo il formato leggibile della data di pubblicazione
    return `
        <div class="card" id="card-${id}">
            <div class="card-content">
                <div class="media">
                    <div class="media-left">
                    <figure class="image is-48x48">
                        <img src="${authorProfileImageUrl}" alt="${authorDisplayName}">
                    </figure>
                    </div>
                    <div class="media-content">
                    <p class="title is-6"><a href="${authorChannelUrl}" target="_blank">${authorDisplayName}</a></p>
                    </div>
                </div>
                <div class="content">
                    ${textDisplay}
                </div>
                <div class="tags has-addons">
                    <time class="tag  is-primary is-light" datetime="2016-1-1">${datePublished}</time>
                    <span class="tag">${likeCount}</span>
                </div>
            </div>
        </div>
    `;
}
```

Ora ci occorre una funzione che vada a iterare la lista dei commenti, che richiami la funzione *commentTemplate* per ogni commento, e che vada a stampare il contenuto dentro il nostro container con id *comments* che avevamo dichiarato all'inizio nel nostro template Html.
```javascript
const printComments = data => {
    const { items } = data;
    if(items){
        container.innerHTML = `${items.map(commentTemplate).join('')}`
    }
}
```

Infine ora basterà richiamare la prima funzione javascript *getComments* che si occuperà di fare la **chiamata GET alle API di youtube**, nel momento i cui arriva la risposta con i commenti, richiamerà *printComments* che a sua volta stamperà ogni commento tramite *commentTemplate*.
```javascript
getComments('Re9PSburA-k')
    .then(data => printComments(data)); 
```

Ed ecco il risultato nello screen:

![](/uploads/youtube-comments-javascript/commenti-youtube-javascript-scree.png)


Trovate il [progetto javascript completo](https://github.com/angepili/youtube-comments) sul [mio github](https://github.com/angepili), dove ho completato stilisticamente il progetto utilizzando il [framework CSS Bulma](https://bulma.io/).