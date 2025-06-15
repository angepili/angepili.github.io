---
title: "API GraphQL vs REST: quando scegliere l'uno o l'altro"
date: 2021-03-18T10:15:00+01:00
draft: false
author : "Angelo"
type : 'pages'
tags : [
    "API",
    "GraphQL",
    "REST",
    "Backend"
]
categories : [
    "Development"
]
summary : "Confronto approfondito tra le API GraphQL e REST: vantaggi, svantaggi e scenari d'uso ideali per ciascuna tecnologia. Quando scegliere GraphQL e quando restare con REST nel 2021."
---

## L'evoluzione delle API: REST vs GraphQL

Nel panorama dello sviluppo web del 2021, la scelta dell'architettura API giusta è diventata una decisione sempre più strategica. REST (Representational State Transfer) è stato per anni lo standard indiscusso per la creazione di API, ma dal 2015, quando Facebook ha rilasciato GraphQL, questa nuova tecnologia ha guadagnato sempre più popolarità.

Entrambe le tecnologie hanno i loro punti di forza e di debolezza, e la scelta tra l'una e l'altra dipende dalle specifiche esigenze del progetto. Analizziamo quindi in dettaglio GraphQL e REST per capire quale sia la soluzione migliore per i diversi scenari.

## REST: il vecchio standard ancora attuale

REST è un'architettura che si basa su un insieme di vincoli e principi per la creazione di servizi web. I principi fondamentali di REST sono:

- **Stateless**: ogni richiesta contiene tutte le informazioni necessarie
- **Uniform Interface**: risorse identificate da URI, manipolate attraverso rappresentazioni
- **Client-Server**: separazione di responsabilità
- **Cacheable**: le risposte devono dichiarare se sono cacheable
- **Sistema a livelli**: un client non può distinguere se è connesso direttamente al server

### Vantaggi di REST

1. **Maturità e adozione**: REST è ampiamente diffuso e compreso
2. **Caching semplificato**: sfrutta il caching HTTP nativo
3. **Tooling consolidato**: ampia disponibilità di strumenti, librerie e framework
4. **Semplicità**: concettualmente semplice da implementare
5. **Ottimo per risorse ben definite**: ideale quando le risorse hanno una chiara gerarchia

```
# Esempio di endpoint REST
GET /api/users/123      # Ottiene i dettagli dell'utente 123
GET /api/users/123/posts # Ottiene i post dell'utente 123
POST /api/posts         # Crea un nuovo post
PUT /api/posts/456      # Aggiorna il post 456
DELETE /api/posts/456   # Elimina il post 456
```

## GraphQL: l'approccio moderno alle API

GraphQL è un linguaggio di query per le API e un runtime per eseguire tali query. A differenza di REST, GraphQL consente ai client di richiedere esattamente i dati di cui hanno bisogno, né più né meno. Un singolo endpoint GraphQL può gestire qualsiasi tipo di query.

### Vantaggi di GraphQL

1. **Fetching mirato dei dati**: i client specificano esattamente quali dati vogliono
2. **Riduzione delle richieste**: una singola richiesta può recuperare dati da più risorse
3. **Type System forte**: schema auto-documentante con tipi definiti
4. **Evoluzione API senza versioning**: aggiungi campi e tipi senza rompere le API esistenti
5. **Frontend-driven**: ideale per team che lavorano su diverse piattaforme frontend

```graphql
# Esempio di query GraphQL
query {
  user(id: "123") {
    id
    name
    email
    posts {
      id
      title
      content
      comments {
        author {
          name
        }
        text
      }
    }
  }
}
```

## Confronto diretto: REST vs GraphQL

### Struttura delle richieste

**REST**:
- Endpoint multipli per diverse risorse
- Struttura delle risposte predefinita dal server
- Generalmente richiede più round-trip per dati relazionali

**GraphQL**:
- Singolo endpoint per tutte le risorse
- Struttura delle risposte definita dal client nella query
- Un'unica richiesta può recuperare dati complessi e relazionali

### Performance

**REST**:
- Rischio di over-fetching (troppi dati) o under-fetching (dati insufficienti)
- Ottimo caching con HTTP standard
- Minore overhead per richieste semplici

**GraphQL**:
- Recupero preciso dei dati necessari
- Caching più complesso da implementare
- Maggiore overhead per query semplici

### Versionamento

**REST**:
- Tipicamente richiede versioning esplicito delle API (v1, v2, ecc.)
- Potenziale proliferazione di endpoint

**GraphQL**:
- Favorisce l'evoluzione continua aggiungendo campi/tipi
- Deprecation dei campi piuttosto che delle intere API

## Casi d'uso ideali nel 2021

### Quando scegliere REST

1. **Applicazioni con risorse ben definite e semplici**
2. **Progetti che necessitano di caching aggressivo**
3. **API pubbliche con una varietà di consumatori**
4. **Quando la semplicità è prioritaria**
5. **Progetti legacy o che richiedono conformità a standard specifici**

Nel 2021, nonostante l'ascesa di GraphQL, REST rimane la scelta ideale per molti progetti, soprattutto quelli con API pubbliche o che richiedono un caching efficiente.

### Quando scegliere GraphQL

1. **App mobile con connessioni lente o limitate**
2. **Interfacce ricche di dati relazionali complessi**
3. **Dashboard e analytics con visualizzazione dei dati personalizzata**
4. **Quando i frontend evolvono rapidamente**
5. **Aggregazione di microservizi o API esistenti**

Il 2021 ha visto un'adozione crescente di GraphQL, specialmente in progetti moderni con frontend React/Vue/Angular e architetture a microservizi.

## Implementazione in stack tecnologici moderni

### REST con Express.js (Node.js)

```javascript
const express = require('express');
const app = express();

// Endpoint per ottenere un utente
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  // Logica per recuperare l'utente dal database
  res.json({ id: userId, name: 'Mario Rossi', email: 'mario@example.com' });
});

// Endpoint per ottenere i post di un utente
app.get('/api/users/:id/posts', (req, res) => {
  const userId = req.params.id;
  // Logica per recuperare i post dell'utente
  res.json([
    { id: '1', title: 'Primo post', content: 'Contenuto...' },
    { id: '2', title: 'Secondo post', content: 'Contenuto...' }
  ]);
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### GraphQL con Apollo Server (Node.js)

```javascript
const { ApolloServer, gql } = require('apollo-server');

// Schema GraphQL
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }
  
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }
  
  type Query {
    user(id: ID!): User
    posts: [Post!]!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    user: (_, { id }) => {
      // Logica per recuperare l'utente
      return { id, name: 'Mario Rossi', email: 'mario@example.com' };
    },
    posts: () => {
      // Logica per recuperare tutti i post
      return [
        { id: '1', title: 'Primo post', content: 'Contenuto...' },
        { id: '2', title: 'Secondo post', content: 'Contenuto...' }
      ];
    }
  },
  User: {
    posts: (user) => {
      // Logica per recuperare i post dell'utente
      return [
        { id: '1', title: 'Post di Mario', content: 'Contenuto...' }
      ];
    }
  },
  Post: {
    author: (post) => {
      // Logica per recuperare l'autore del post
      return { id: '123', name: 'Mario Rossi', email: 'mario@example.com' };
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`GraphQL server running at ${url}`);
});
```

## Approccio ibrido: il meglio dei due mondi

Nel 2021, una tendenza emergente è l'adozione di un approccio ibrido, dove GraphQL viene utilizzato insieme a REST anziché come sostituto. Questo approccio consente di:

1. Mantenere endpoint REST esistenti per casi d'uso semplici o API pubbliche
2. Introdurre GraphQL per nuove funzionalità o frontend complessi
3. Utilizzare GraphQL come gateway per aggregare API REST esistenti
4. Fornire diversi livelli di accesso ai dati per diversi tipi di client

## Conclusioni

La scelta tra REST e GraphQL nel 2021 non è semplicemente questione di quale tecnologia sia "migliore", ma piuttosto di quale sia la più adatta alle specifiche esigenze del progetto.

REST continua a brillare per la sua semplicità, caching integrato e ampia adozione, mentre GraphQL offre flessibilità, recupero dati efficiente e un'esperienza di sviluppo frontend migliorata.

Molti progetti di successo stanno adottando un approccio pragmatico, utilizzando GraphQL dove necessario e REST dove appropriato, sfruttando i punti di forza di entrambe le tecnologie.

La tendenza per il futuro prossimo sembra essere una coesistenza pacifica tra REST e GraphQL, con un'adozione crescente di quest'ultimo per applicazioni moderne con requisiti di dati complessi, ma con REST che mantiene un ruolo importante nell'ecosistema delle API.
