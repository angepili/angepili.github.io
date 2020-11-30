---
title: "Svelte Framework: come funziona, una veloce introduzione."
date: 2020-09-02T21:45:33+02:00
draft: false
author : "Angelo"
image : "/uploads/svelte-js/svelte-js.png"
type : 'pages'
tags : [
    "Svelte",
    "Javascript"
]
categories : [
    "Development"
]
summary : "Che cos'è e come funziona Svelte framework? Andiamo ad analizzare come funziona questo framework che fa dei suoi punti forti la reattività, la semplicità e velocità."
---

## Cos'è Svelte e come funziona
Svelte è un framework JavaScript, gratuito ed open source, rilasciato da Rich Harris nel 2016 e ormai arrivato alla versione 3. 

Come **React**, **Vue** e **Angular** si basa su i concetti di reattività e di componente, ma è diverso perchè:
- è open source, non gestito da corporate come Google e Facebook. La repo infatti è disponibile su [github](https://github.com/sveltejs/svelte) e chiunque è libero di poter dare un contributo
- come **Vue**, si possono combinare javascript, css e html in unico file
- non lavora sul Virtual DOM, ma sul DOM
- non è il Browser che interpreta l'applicazione, Svelte lavora in fase di compilazione, producendo javascript vanilla leggero e appunto più veloce
- il Css è nativmente scoped per il blocco di codice presente nel file
- di default non ha webpack ma rollup

Punti a sfavore: essendo un progetto giovane, ha ancora un comunity molto ridotta e si trova poco materiale in giro. In realtà la [documentazione di Svelte](https://svelte.dev/docs) è molto semplice, e per impararlo basta conoscere Javascript; sicuramente aiuta aver già avuto a che fare con i suoi competitor React e Angular, più per i concetti che per sintassi.

## Come iniziare con Svelte framework
Per iniziare a sviluppare con Svelte possiamo andare a posizionarci sulla nostra directory e lanciare questi comandi:
```bash
npx degit sveltejs/template svelte-project
cd svelte-project

npm install
npm run dev
```

Una volta avviato il tutto, andiamo nella cartella di lavoro `src`. Noteremo due file, il primo: `main.js`:
```js
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;
```
Da qui ha inizio la nostra applicazione, infatti inizilizzando `App`, tramite `target` scegliamo l'elemento html in cui far girare il nostro applicativo, di default sul body; mentre tramite `props` possiamo passare delle properties di inizializzazione.

Notiamo che prima viene eseguito un import del componente principale: un file App con estensione .svelte:

```html
<script>
	export let name;
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
```
Come già suggerisce l'estensione di questo file, tutti i componenti dovranno avere estensione .svelte. Notiamo subito appunto come dentro un file possiamo **scrivere la parte di javascript, css e html**. 

Nella parte di script, viene esportata la variabile `name` che è appunto la proprietà passata dal file genitore, quindi in ogni componente dovremmo esportare le proprietà che vengono passate.

L'html è libero, non ha alcuna differenza con il classico markup, ma ci sono delle aggiunte. Infatti ogni variabile viene racchiusa tra le graffe `{name}`.

Infine lo style è nativamente scoped, quindi per un componente semplice, possiamo anche non utilizzare classi css e id, in quanto, esattamente come l'esempio, potremmo scrivere css indicando solo l'elemento html così com'è, e ci penserà svelte a indicare che è riferito solo a questo componente. Ovviamente per componenti più complessi, l'uso di una classe è indicato, tuttavia sarà trattata sempre in maniera scoped e non globale.

## Come creare un componente Svelte
L'esempio di `App.svelte` suggerisce già tutto, basterà creare un nuovo file con estensione svelte, ad esempio `Header.svelte`, nel componente padre andrò ad importarlo a richiamarlo nel markup:
```vue
// App.svelte
<script>
    import Header from './Header.svelte';
	export let name;
</script>

<Header />

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

...

```

Adesso passare una property è molto semplice, come detto sopra, nel file del componente esporteremo la variabile, e nel file padre dove dichiariamo il componente lo passiamo come attributo:
```vue
// Header.svelte
<script>
    export let companyName;
</script>

<p>{companyName}</p>

<style>
p { color: red; }
</style>
```

```vue
// App.svelte
<script>
    import Header from './Header.svelte';
	export let name;
</script>

<Header companyName={"Google"} />

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

...

```


## Utilizzare gli if statement
Con Svelte framework possiamo utilizzare le condizioni dentro l'Html, sono disponibili infatti:
- `if`
- `if elseif`
- `if else`

Non possono ovviamente sostituire le logiche impostate nel Javascript, ma possono tornare utili nei casi in cui si deve mostrare un componente o meno, o per verificare un dato velocemnte direttamente nel markup.

Ad esempio con il framework Svelte possiamo fare qualcosa del genere:
```html
// Header.svelte
<script>
    export let companyName;
</script>

{#if companyName == "Google"}
	<p>Ok è Google</p>
{/if}

{#if companyName == "Google"}
	<p>Ok è Google</p>
{:else if companyName == "Apple"}
	<p>Ah no è Apple</p>
{/if}

{#if companyName == "Google"}
	<p>Ok è Google</p>
{:else}
	<p>Altra azienda</p>
{/if}

<style>
p { color: red; }
</style>
```


## Bello Svelte framework, ma questo è solo l'inizio

In questo post abbiamo visto una piccola **introduzione a Svelte framework**, infatti questo framework è molto più: lifecycle dei componenti, binding, slot, eventi, gestioni dello stato, più tante altre cose. E non è tutto, gli stessi creatori hanno anche sviluppato [Sapper](https://sapper.svelte.dev/), un framework completo per creare webapp, basato su svelte, con routing, server side rendering, code splitting, insomma un sistema strutturato molto interessante.

Nei prossimi articoli cercherò di approfondire Svelte sempre più, partendo sempre da piccoli esempi; iniziamo con questo primo progettino di test che ho realizzato: [Youtube Svelte](https://github.com/angepili/youtube-svelte) disponibile sul [mio github](https://github.com/angepili/) dove ho provato a sviluppare un piccolo motore di ricerca di youtube utilizzando le API, Svelte e Bulma. come framework Css.