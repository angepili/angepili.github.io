---
author : "Angelo"
title : "Linkedin Login con Postman"
date : "2020-07-19"
image : "/uploads/linkedin-part-1/linkedin-api-postman.png"
type : 'pages'
draft : false
tags : [
    "API",
    "Postman",
    "Linkedin"
]
categories : [
    "Development"
]
aliases : ["linkedin-api"]
summary : "Linkedin Login tramite le API, eseguire una semplice autenticazione, e ottenere i dati dell'utente e pubblicare qualcosa sulla propria bacheca."
---

Linkedin, entrato a far parte nel 2016 della galassia di prodotti Microsoft, è sicuramente la piattaforma social più utilizzata nel contesto professionale e quindi nel mondo del lavoro; come la maggior parte di questi strumenti, sono disponibili delle API pubbliche per poter interagire ed integrare flussi custom.

Per poter eseguire queste integrazioni, Microsoft mette a disposizione una buona [documentazione](https://docs.microsoft.com/it-it/linkedin/) semplice da leggere e capire.

## Creare l'applicazione
Prima di tutto occorre registrare una nuova applicazione dalla [dashboard dedicata](https://www.linkedin.com/developer/apps/new). 

Ci verranno richiesti alcuni campi da compilare come: nome dell'app, logo e privacy.

![](/uploads/linkedin-part-1/schermata-linkedin-1.png)

Dopo aver salvato invece potremmo accedere al pannello completo di amministrazione, infatti cliccando sul tab "Auth" avremmo il box chiamato "OAuth 2.0 settings", dove è importante inserire un nostro indirizzo di ritorno, per poter completare il processo di autenticazione. In fase di sviluppo è possibile utilizzare *localhost*, *127.0.0.1*, o anche l'indirizzo completo di porte, tipo *127.0.0.1:3000*.

Per iniziare, quindi inseriamo il nostro indirizzo di svilippo con un */linkedin.html* alla fine, ex: *127.0.0.1:8000/linkedin.html*

Poco sopra, ci sono 2 dati molto importati per la nostra applicazione: il *client_id* e il *client_secret*; questi sono gli identificatori del nostro applicativo, il primo pubblico, e quindi può essere utilizzato in chiaro nelle chiamate, il secondo è privato.

![](/uploads/linkedin-part-1/schermata-linkedin-2.png)

Dal tab "Products" aggiungiamo i prodotti:
- Sign In with LinkedIn
- Share on LinkedIn

Il primo ci darà i permessi per poterci autenticare con la piattaforma, il secondo di condividere un post.

![](/uploads/linkedin-part-1/schermata-linkedin-3.png)

## Usiamo l'autenticazione Oauth2
Linkedin utilizza lo standard di autenticazione [Oauth2](https://oauth.net/2/), un metodo sicuro, adottato da tante piattaforme, che in parole molte semplici, permette di effettuare le operazioni su API attraverso un token con una certa data di scadenza, che rilascia il servizio dopo una prima autenticazione, e che verra inviato ad ogni chiamata.

Per ottenerlo dobbiamo prima eseguire una chiamata per ottenere il *code*, con i seguenti parametri:

```yaml
METODO: GET
URL: https://www.linkedin.com/oauth/v2/authorization
PARAMETRI:
    response_type=code 
    client_id=${cliente_id} # dalle impostazioni dell'app
    state=${$state} # un numero casuale, va bene anche un timestamp
    redirect=${redirect_uri} # redirect di ritorno dell'app http://localhost:8000/linkedin.php
    scope=r_liteprofile+r_emailadress
```

Prima di eseguire la chiamata, modifichiamo il nostro file linkedin.php per ottenere direttamente in pagina i parametri che ci servono, altrimenti dovremmo estrapolarli dalla url.

```php
<?php
print $_GET['code'];
print $_GET['state']
```

Chiamando questo indirizzo, ci verrà chiesto se vogliamo autorizzare l'app ad utilizzare i nostri dati; proseguendo verremmo reindirizzati al nostro *redirect_url* impostato sull'app, con il code e lo state. Quindi direttamente dal browser effettuiamo la chiamato:
```url
https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${client_id}&state=19890211&redirect_uri=http://localhost:8000&scope=r_liteprofile+r_emailaddress
```


A questo punto apriamo Postman, su una nuova scheda, impostiamo i seguenti parametri
```yaml
METODO: POST
URL: https://www.linkedin.com/oauth/v2/accessToken
PARAMETRI:
    grant_type: authorization_code
    client_id: ${client_id}
    client_secret: ${client_secret}
    redirect_uri: http://localhost:8000/linkedin.php
    code: ${code} # il "code" ottenuto nella chiamata precedente
```

![](/uploads/linkedin-part-1/schermata-linkedin-4.png)

A questo punto abbiamo ottenuto il token, e quindi ci siamo autenticati. Infatti d'ora in poi possiamo eseguire tutte le nuove chiamate utilizzando il token nei parametri dell'header della chiamata, e verremo sempre riconosciuti.

## Ottenere i dati del profilo
Ad esempio, possiamo ottenere le informazioni del nostro utente, o dell'utente per cui si ha il token attivo, eseguendo questa chiamata:

```yaml
METODO: GET
URL: https://api.linkedin.com/v2/me
PARAMETRI: no
HEADERS:
    Authorization: Bearer ${access_token}
```

Response:
```json

{
    "localizedLastName": "Pili",
    "lastName": {
        "localized": {
            "en_US": "Pili"
        },
        "preferredLocale": {
            "country": "US",
            "language": "en"
        }
    },
    "firstName": {
        "localized": {
            "en_US": "Angelo"
        },
        "preferredLocale": {
            "country": "US",
            "language": "en"
        }
    },
    "profilePicture": {
        "displayImage": "urn:li:digitalmediaAsset:id-dell'immagine-di-profilo"
    },
    "id": "id-dell'utente",
    "localizedFirstName": "Angelo"
}
```

![](/uploads/linkedin-part-1/schermata-linkedin-5.png)


Nel prossimo post vedremo i passaggi successivi: la [login su linkedin con javascript](/post/linkedin-api-javascript) e ancora nel successivo **Pubblicare un post con le API di Linkedin**.