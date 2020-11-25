---
author : "Angelo"
title: "Ottenere i commenti di un video Youtube tramite API con Postman"
date: 2020-08-17T17:22:42+02:00
draft: false
image : "/uploads/youtube-comments/youtube-comments.png"
type : 'pages'
tags : [
    "Youtube",
    "API",
    "Postman"
]
categories : [
    "Development"
]
summary : "Tramite le API di Youtube è possibile ottenere dati di canali, video, ed insighits in maniera molto semplice. In questo post vediamo come ottenere la lista dei commenti di un Video tramite API in formato Json."
---

Per lavorare con le API di Youtube occorre inanzitutto un account Google per poter accedere alla [Console di Google](https://console.developers.google.com/), creare un API key e, tra tutti i servizi messi a dispozione, abilitare Youtube.

Ottenuta l'API Key, possiamo eseguire subito la nostra richiesta in GET con i seguenti parametri:
```yaml
METODO: GET
URL: https://www.googleapis.com/youtube/v3/commentThreads
PARAMETRI: 
    key: 0123456789
    videoId: ABCDEFG1234
    part: snippet,replies
    maxResults: 100
```

Vediamo nel dettaglio i parametri:
- inseriamo la nostra API key come valore di *key*.
- il parametro *videoID* conterrà l'ID del video; è facilmente reperibile dalla URL youtube, basterà copiare il valore del parametro `v`, ad esempio nella URL https://www.youtube.com/watch?v=9EcjWd-O4jI il parametro equivale a `9EcjWd-O4jI`.
- con il parametro *part* andiamo ad indicare quali contenuti della risposta vogliamo ricevere, infatti utilizzeremo `snippet` che contiene il dettaglio del commento, e `replies` che sono le eventuali repliche ad un commento.
- mentre *maxResults* parla da solo, andiamo ad indicare quanti sono i commenti massimi che intendiamo ricevere. Si può indicare un valore tra 0 e 100, infatti se il video presenta più di 100 commenti, occorrerà utilizzare la paginazione, usando il valore di `nextPageToken` che troveremo nella risposta.

## Usare Postman per testare l'API di youtube

Ora possiamo fare un test di chiamata con Postman usando il metodo GET ed inserendo i parametri come da schermata qui sotto, così da verificare la corretta esecuzione e la risposta restituita.

![](/uploads/youtube-comments/youtube-api-comments-postman.png)

Se tutto è andato a buon fine, la **API di youtube** ci restituirà una risposta che conterrà un oggetto Json con il token di paginazione ed i risultati dentro la voce `items`, con questa struttura:
```json
{
  "kind": "youtube#commentThreadListResponse",
  "etag": "c9KByPuS9hbsT3kYq232RoBRClA",
  "nextPageToken": "QURTSl9pMUJDRUdkak9xeHJFckZJT3hyeW1FUHBsUlRuMjVNVjdNTlhUYjNydXVaZWtYU3N1Y3FnVkZlWEQxbXpMTnM4SFh1N1RURWZuQmFTdVdfVTBlWXJxWEZXNWcyRVM0VkRYaW1hMFlmSGhxMnpza2EzdlI3a0JITWtzWmw=",
  "pageInfo": {
    "totalResults": 100,
    "resultsPerPage": 100
  },
  "items": [
    {
      "kind": "youtube#commentThread",
      "etag": "1c3Fcigyy09KA7YJnFCyp57s0PE",
      "id": "UgxUzdW-bddgCls3iD94AaABAg",
      "snippet": {
        "videoId": "9bZkp7q19f0",
        "topLevelComment": {
          "kind": "youtube#comment",
          "etag": "uygUBwAFfAKVXIf53X5F1582Qro",
          "id": "UgxUzdW-bddgCls3iD94AaABAg",
          "snippet": {
            "videoId": "9bZkp7q19f0",
            "textDisplay": "Шок!на этом видео видно как Влад бумага ворует <a href=\"https://youtu.be/8rm6cRFVKHk\">https://youtu.be/8rm6cRFVKHk</a>",
            "textOriginal": "Шок!на этом видео видно как Влад бумага ворует https://youtu.be/8rm6cRFVKHk",
            "authorDisplayName": "alex mironov",
            "authorProfileImageUrl": "https://yt3.ggpht.com/a/AATXAJzpQccOUknezYdJwF1IyvLTJawgmTm4BdUcZcSG6w=s48-c-k-c0xffffffff-no-rj-mo",
            "authorChannelUrl": "http://www.youtube.com/channel/UCFYuhxGHrtfOcHf7QsTFdZw",
            "authorChannelId": {
              "value": "UCFYuhxGHrtfOcHf7QsTFdZw"
            },
            "canRate": true,
            "viewerRating": "none",
            "likeCount": 1,
            "publishedAt": "2020-08-17T15:42:06Z",
            "updatedAt": "2020-08-17T15:42:06Z"
          }
        },
        "canReply": true,
        "totalReplyCount": 0,
        "isPublic": true
      }
    },
    ...
  ]
}
```

Tutta la documentazione è disponibile sull'area [developers di Google](https://developers.google.com/youtube/v3/docs/commentThreads/list)

Questo post mostra come interrogare l' API di yotube con Postman, mentre nel prossimo articolo vedremo [**Come ottenere i commenti Youtube tramite API con Javascript**](/pages/commenti-youtube-javascript/), andremmo quindi ad eseguire questa chiamata direttamente dal browser, dall'API otterremo la risposta con i commenti di Youtube in formato JSON, e proveremo ad impaginarli in un widget Html.