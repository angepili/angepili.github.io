---
author : "Angelo"
title : "Linkedin Login con Javascript"
date : "2020-07-24"
type : 'pages'
draft : false
tags : [
    "API",
    "Javascript",
    "Linkedin"
]
categories : [
    "Development"
]
aliases : ["linkedin-javascript"]
summary : "Come sviluppare una login linkedin con le API in Javascript ES6: attraverso l'utilizzo delle Promise andiamo a fare l'autenticazione e prendere i dati del profilo."
---

Nel precedente post [Linkedin Login con Postman](/post/linkedin-api-postman) abbiamo visto come consumare le **API di linkedin** attraverso postman, ora invece passiamo ai fatti rieseguendo tutti i passaggi con Javascript.

Per comodità utilizzeremo lo scaffolding di Parcel, dato che di partenza ha già tutto configurato ( ho scritto un post a riguardo [Creare un progetto parceljs](/post/creare-progetto-parceljs/) ), ma volendo si può integrare in qualsiasi altro scaffolding ad esempio webpack.

Per connetterci avremmo bisosgno quindi di un bottone "accedi con linkedin" e un div che farà da wrapper per restituire i nostri dati dopo l'autenticazione. In un file html quindi ci mettiamo il giusto necessario:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Linkedn</title>

</head>
<body>

    <img src="https://content.linkedin.com/content/dam/developer/global/en_US/site/img/signin-button.png" alt="linkedin" id="linkedin-login">

    <div id="profile"></div>

    <script src="./index.js"></script>
</body>
</html>
```

Passiamo alla parte di Javascript ed iniziamo ad installare le dipendenze, ci serviranno:
- [axios](https://www.npmjs.com/package/axios): per le richieste http
- [querystring](https://www.npmjs.com/package/qs): per convertire in stringa i parametri da un oggetto
- [store](https://www.npmjs.com/package/store): per memorizzare i dati su local storage

quindi da terminale:
```shell
npm i --save axios querystring store
```

e sul nostro file Javascript
```javascript
import axios from 'axios';
import querystring from 'querystring';
import store from 'store';
```

Creiamo un file .env sulla root del progetto con i seguenti parametri
```toml
CLIENT_ID=${tuo-cliente-id}
CLIENT_SECRET=${tuo-cliente-secret}
REDIRECT_URI=${tuo-redirect}
```
Con il .env avremo ben separati la parte di variabili di ambiente dal codice, ed avere quindi la possibilità di diversi setting per locale e produzione; ovviamente questo file sarebbe utile tracciarlo sul .gitignore per escluderlo dal versionamento.

Iniziamo a dichiarare un pò di variabili sul Javascript, tra cui anche quelle di ambiente:

```js
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

const corsUrl = 'https://cors-anywhere.herokuapp.com/'; // Proxy per bypassare CORS

// Endpoint
const url = {
    auth    : 'https://www.linkedin.com/oauth/v2/authorization',
    token   : 'https://www.linkedin.com/oauth/v2/accessToken',
    me      : 'https://api.linkedin.com/v2/me'
}

const parameters = new URLSearchParams(window.location.search); // Per ottenere i parametri GET
const btnLogin = document.getElementById('linkedin-login'); // Bottone
const wrapper = document.getElementById('profile'); // Wrapper
```

## Le funzioni javascript per la login API di Linkedin

Ora che abbiamo tutte le variabili di cui abbiamo bisogno, possiamo iniziare a scrivere le funzioni che richiameranno gli endpoint, e restituiranno le informazioni che ci occorrono.
La prima funziona che ci occorre è quella che apre la login di Linkedin e ci restituisce il parametro *code*:
```javascript
const LnkLogin = ()=> {
    const params = {
        response_type:'code',
        client_id: client_id,
        state: Math.floor(Date.now() / 1000),
        redirect_uri: redirect_uri,
        scope: 'r_liteprofile r_emailaddress w_member_social'
    }
    const urlWindow = `${getEndpoint('auth',false)}?${querystring.stringify(params)}`;
    window.open(urlWindow,'_self');
}
```

Dobbiamo richiedere il token di sessione a Linkedin, imprescindibile per eseguire tutte le future chiamate. 
Con javascript inizializzeremo una promises: 
```javascript
const LnkToken = ()=> {
    const config = {
        grant_type : 'authorization_code',
        client_id : client_id,
        client_secret : client_secret ,
        redirect_uri : redirect_uri,
        code : parameters.get('code')
    }
    return new Promise((resolve, reject) => {
        axios.post(getEndpoint('token'),querystring.stringify(config),{
            headers: { 
                'content-type': 'application/x-www-form-urlencoded',
            },
        })
        .then ( result => {
            resolve(result.data.access_token) 
        })
        .catch( err => reject(err) )
    });
}
```

Ora che abbiamo ottenuto il token, siamo autenticati con Linkedin e d'ora in poi dovremmo passarlo nell'header della richiesta con un Authorization Bearer.
Questa chiamata all'API ci permetterà di ottenere i nostri dati personali come nome, cognome ed indirizzo email.
```javascript
const LnkMe = ()=> {
    const { token } = store.get('linkedin');
    return new Promise((resolve, reject) => {
        axios.get(getEndpoint('me'),{
            headers: { 
                'Authorization': `Bearer ${token}`,
            },
        })
        .then ( response => {
            if(response.data?.id) {
                store.set('linkedin',{
                    ...store.get('linkedin'),
                    ...response.data
                })
                resolve(response.data)
            }
            reject(err)
        })
        .catch( err => reject(err) )
    });
}
```

Non è previsto un endpoint per eseguire il logout, semplicemente andremmo a distruggere il token, i dati che abbiamo memorizzato e reinizializziamo l'applicazione.

```js
/**
 * Eseguo il logout
 */
const LnkLogout = () => {
    const btnExit = document.getElementById('logout');
        btnExit.addEventListener('click',()=> { 
            store.clearAll();
            btnLogin.style.display = 'block';
            wrapper.innerHTML = '';
            window.location.search = '';
            init();
        })
}
```

Per comodità, mettiamo tutto in una funziona l'output dei dati
```js
/**
 * Stampo i miei dati
 */
const LnkProfile = ()=> {
    const { localizedFirstName: firstname, localizedLastName: lastname  } = store.get('linkedin');
    wrapper.innerHTML = `
        Benvenuto <strong>${firstname} ${lastname}</strong> | <a href="javascript:void(0)" id="logout">Logout</a>
    `
    return;
}
```

La funzione di inizializzazione verifica in quale stato siamo, e richiama gli eventi necessari
```js
const init = ()=> {
    const linkedin = store.get('linkedin');
    // Se sono loggato, esiste l'oggetto linkedin, e quindi il token
    if( linkedin && linkedin.token ){

        btnLogin.style.display = 'none' // Nascondo il bottone
        LnkProfile(); // Stampo i dati
        LnkLogout(); // Se clicco su logout, distruggo la sessione
    } 
    // Abbiamo appena ottenuto il CODE ma non ancora il token
    else if(parameters.get('code') && !linkedin?.token ){

        btnLogin.style.display = 'none' // nascondo il bottone

        LnkToken() // Avvio la catena di richieste per connettermi a linkedin
        .then( token => store.set('linkedin',{ token: token }) )
        .then( ()=> LnkMe() )
        .then( ()=> LnkProfile() )
        .then( ()=> LnkLogout() )
        .catch( err => console.log(err) )

    } 
    // Lo stato di partenza, ancora non ho nulla, devo intereccettare il click del bottone
    else {
        btnLogin.addEventListener('click', ()=> LnkLogin() );
    }
}
```

Infine per far partire l'applicazione, basterà richiamare la funzione *init()*

L'applicazione completa è disponibile su github [Linkedin Login](https://github.com/angepili/linkedin-login)

Nel prossimo post, vedremo come **Pubblicare un post su linkedin tramite le API**