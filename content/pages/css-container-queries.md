---
title: "CSS Container Queries: il futuro del responsive design oltre i media queries"
date: 2022-06-21T09:30:00+02:00
draft: false
author : "Angelo"
type : 'pages'
tags : [
    "CSS",
    "Frontend",
    "Responsive Design"
]
categories : [
    "Development"
]
summary : "CSS Container Queries rappresentano un'evoluzione fondamentale nel responsive design: scopri come creare layout che rispondono alle dimensioni del container invece che della viewport, con esempi pratici e casi d'uso."
---

## L'evoluzione del responsive design: dai Media Queries ai Container Queries

Il responsive design è stato rivoluzionato nel 2010 con l'introduzione delle Media Queries, che ci hanno permesso di adattare i layout in base alle dimensioni dello schermo. Tuttavia, per oltre un decennio, gli sviluppatori hanno dovuto affrontare una limitazione fondamentale: non potevamo modificare lo stile di un componente in base al suo contenitore, ma solo in base alla dimensione dell'intera viewport.

Nel 2022, questa limitazione è finalmente superata grazie ai **CSS Container Queries**, una delle novità più attese e rivoluzionarie nel mondo del CSS moderno. Questa nuova funzionalità ci permette di creare componenti veramente riutilizzabili e adattivi, che rispondono alle dimensioni del loro contenitore anziché della viewport.

## Cosa sono i CSS Container Queries

I Container Queries permettono di applicare stili a un elemento in base alle dimensioni del suo contenitore. Questo significa che lo stesso componente può adattarsi in modo diverso a seconda dello spazio che ha a disposizione, indipendentemente dalle dimensioni dello schermo.

La sintassi di base è simile a quella dei Media Queries, ma invece di interrogare la viewport, interroghiamo il contenitore:

```css
/* Definiamo un elemento come contenitore */
.container {
  container-type: inline-size;
  container-name: content;
}

/* Applichiamo stili diversi in base alla larghezza del contenitore */
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
  }
}

@container (max-width: 399px) {
  .card {
    display: flex;
    flex-direction: column;
  }
  .card-image {
    width: 100%;
    height: 200px;
  }
}
```

## Supporto browser nel 2022

A metà 2022, i Container Queries stanno finalmente diventando una realtà utilizzabile:

- **Chrome**: supporto completo dalla versione 105 (Agosto 2022)
- **Firefox**: in fase di implementazione (supporto sperimentale)
- **Safari**: supporto completo dalla versione 16 (Settembre 2022)

Per progetti che richiedono supporto per browser più datati, è possibile utilizzare polyfill come [container-queries-polyfill](https://github.com/GoogleChromeLabs/container-query-polyfill) sviluppato da Google Chrome Labs.

## Container Queries vs Media Queries

| Aspetto | Media Queries | Container Queries |
|---------|--------------|------------------|
| Base di riferimento | Viewport del browser | Contenitore dell'elemento |
| Riutilizzabilità componenti | Limitata | Elevata |
| Casi d'uso ideali | Layout generale della pagina | Componenti modulari e riutilizzabili |
| Combinazione con grid/flexbox | Necessita adattamenti globali | Adattamenti locali e precisi |
| Semplicità di manutenzione | Può diventare complesso | Più semplice e modulare |

## Esempi pratici di utilizzo

### Esempio 1: Card responsive

Immaginiamo di avere una card che può apparire in diverse sezioni del layout con spazi diversi:

```html
<div class="sidebar container">
  <div class="card">
    <img class="card-image" src="image.jpg" alt="Image">
    <div class="card-content">
      <h2>Titolo Card</h2>
      <p>Descrizione della card che può essere lunga o breve a seconda del contesto.</p>
      <button>Leggi di più</button>
    </div>
  </div>
</div>

<div class="main-content container">
  <div class="card">
    <!-- Stesso contenuto della card, ma si adatterà diversamente -->
    <img class="card-image" src="image.jpg" alt="Image">
    <div class="card-content">
      <h2>Titolo Card</h2>
      <p>Descrizione della card che può essere lunga o breve a seconda del contesto.</p>
      <button>Leggi di più</button>
    </div>
  </div>
</div>
```

```css
.container {
  container-type: inline-size;
  container-name: card-container;
}

/* Layout predefinito (piccolo) */
.card {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

/* Layout per container più grandi di 400px */
@container card-container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 150px 1fr;
  }
  
  .card-image {
    height: 100%;
  }
}

/* Layout per container più grandi di 600px */
@container card-container (min-width: 600px) {
  .card {
    grid-template-columns: 250px 1fr;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .card h2 {
    font-size: 1.5rem;
  }
}
```

### Esempio 2: Galleria di immagini

Una galleria di immagini che si adatta al suo contenitore:

```html
<div class="gallery-container container">
  <div class="gallery">
    <div class="gallery-item"><img src="image1.jpg" alt=""></div>
    <div class="gallery-item"><img src="image2.jpg" alt=""></div>
    <div class="gallery-item"><img src="image3.jpg" alt=""></div>
    <div class="gallery-item"><img src="image4.jpg" alt=""></div>
    <div class="gallery-item"><img src="image5.jpg" alt=""></div>
    <div class="gallery-item"><img src="image6.jpg" alt=""></div>
  </div>
</div>
```

```css
.gallery-container {
  container-type: inline-size;
  container-name: gallery;
}

.gallery {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, 1fr);
}

@container gallery (min-width: 400px) {
  .gallery {
    grid-template-columns: repeat(3, 1fr);
  }
}

@container gallery (min-width: 700px) {
  .gallery {
    grid-template-columns: repeat(4, 1fr);
  }
}

@container gallery (min-width: 900px) {
  .gallery {
    grid-template-columns: repeat(6, 1fr);
  }
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
```

## Integrazione con altre funzionalità CSS moderne

I Container Queries si integrano perfettamente con altre funzionalità moderne del CSS, creando possibilità ancora più potenti:

### Container Queries + CSS Grid

```css
.grid-container {
  container-type: inline-size;
  display: grid;
  gap: 1rem;
}

/* Layout base: una colonna */
.grid-container {
  grid-template-columns: 1fr;
}

/* Container medio: due colonne */
@container (min-width: 500px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Container grande: tre colonne con diverse proporzioni */
@container (min-width: 800px) {
  .grid-container {
    grid-template-columns: 1fr 2fr 1fr;
  }
}
```

### Container Queries + Custom Properties

```css
.dynamic-text-container {
  container-type: inline-size;
}

.dynamic-text {
  --min-font-size: 1rem;
  --max-font-size: 2.5rem;
  --fluid-scale: 1vw;
  
  font-size: var(--min-font-size);
}

@container (min-width: 300px) {
  .dynamic-text {
    font-size: calc(var(--min-font-size) + var(--fluid-scale));
  }
}

@container (min-width: 600px) {
  .dynamic-text {
    font-size: var(--max-font-size);
  }
}
```

## Vantaggi per lo sviluppo di componenti

I Container Queries sono un game-changer per lo sviluppo di componenti riutilizzabili:

1. **Vera modularità**: i componenti si adattano al contesto in cui vengono inseriti
2. **Design System più flessibili**: gli stessi componenti funzionano in contesti diversi
3. **Sviluppo più efficiente**: riduzione della duplicazione del codice
4. **Gestione semplificata del layout**: meno workaround e hack

## Sfide e considerazioni

### Prestazioni

I Container Queries introducono un ulteriore livello di complessità nel rendering, quindi è importante usarli con criterio. Per ottimizzare le prestazioni:

- Limita il numero di contenitori nidificati
- Utilizza il valore `container-type: inline-size` quando devi interrogare solo la larghezza
- Evita di riapplicare lo stesso stile a contenitori multipli

### Integrazione con framework JS

I framework come React, Vue e Angular stanno già iniziando a integrare i Container Queries nelle loro soluzioni di styling. Ad esempio:

- **React**: librerie come Styled Components stanno aggiungendo supporto
- **Vue**: la nuova Composition API facilita l'integrazione con i Container Queries
- **Angular**: integrazione con i Component Styles

## Conclusione

I CSS Container Queries rappresentano un'evoluzione significativa per il responsive design. Nel 2022, con il supporto che finalmente sta arrivando nei principali browser, è il momento perfetto per iniziare a esplorare questa tecnologia e incorporarla nei nuovi progetti.

Questa nuova funzionalità ci permette di pensare in modo "component-first" anziché "viewport-first", rendendo i nostri componenti più riutilizzabili e adattivi a diversi contesti. La combinazione di Container Queries con altre funzionalità moderne del CSS ci offre strumenti potenti per creare interfacce web veramente flessibili e dinamiche.

Mentre i Media Queries continueranno ad essere utili per layout di livello superiore, i Container Queries diventeranno lo strumento prediletto per la progettazione di componenti modulari e riutilizzabili, portando il responsive design a un livello completamente nuovo.
