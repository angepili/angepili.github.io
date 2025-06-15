---
title: "Angular 13: novità e miglioramenti"
date: 2021-11-05T10:30:00+01:00
draft: false
author: "Angelo"
type: 'pages'
tags: [
    "Angular",
    "TypeScript",
    "Frontend",
    "JavaScript"
]
categories: [
    "Development"
]
summary: "Scopriamo tutte le novità di Angular 13: View Engine rimosso a favore di Ivy, componenti più performanti, miglioramenti significativi nelle form API e nel CLI, e cosa significa questo per lo sviluppo di applicazioni moderne."
---

## Angular 13: una nuova era per il framework

Angular 13 è stato rilasciato a novembre 2021, segnando un passo importante nell'evoluzione del framework. Questa versione segna l'abbandono definitivo di View Engine a favore di Ivy, il sistema di rendering più moderno ed efficiente introdotto negli ultimi anni.

Vediamo insieme tutte le novità e i miglioramenti di questa release importante che consolida il ruolo di Angular nell'ecosistema frontend del 2021.

## Addio a View Engine, benvenuto Ivy

La novità più importante di Angular 13 è l'eliminazione completa di View Engine. Ora Ivy è l'unico motore di rendering e compilazione per Angular. Questo passaggio rappresenta l'abbandono di un sistema legacy a favore di una tecnologia più moderna, con numerosi vantaggi:

- **Bundle più piccoli**: la compilazione con Ivy produce pacchetti più compatti
- **Migliore tree-shaking**: riduzione significativa del codice inutilizzato
- **Debugging più semplice**: errori più chiari e significativi
- **Compilazione più veloce**: riduzione dei tempi di build

```typescript
// Esempio di componente Angular 13 con tipizzazione stretta
@Component({
  selector: 'app-user-profile',
  template: `
    <div class="user-card">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <button (click)="updateUser()">Aggiorna</button>
    </div>
  `
})
export class UserProfileComponent {
  // Tipizzazione stretta migliorata in Angular 13
  user: User = {
    id: 1,
    name: 'Mario Rossi',
    email: 'mario.rossi@example.com'
  };

  updateUser(): void {
    // logica di aggiornamento
  }
}
```

## Miglioramenti nelle Form API

Angular 13 porta significativi miglioramenti nelle form API:

### TypeScript 4.4 e tipizzazione più stretta

Con il supporto a TypeScript 4.4, Angular 13 migliora la tipizzazione delle form:

```typescript
// Prima di Angular 13
const form = new FormGroup({
  name: new FormControl(''), // tipo any
  email: new FormControl('')
});

// Con Angular 13
const form = new FormGroup({
  name: new FormControl<string>(''), // tipizzazione esplicita
  email: new FormControl<string>('')
});
```

### Nuova API per i FormControl

Angular 13 introduce un modo più intuitivo per gestire lo stato dei controlli:

```typescript
// Nuovo approccio in Angular 13
const nameControl = new FormControl('Mario');

// Ora è possibile usare metodi più intuitivi
nameControl.disable(); // disabilita il controllo
nameControl.setValidators([Validators.required]); // imposta validatori
```

## Miglioramenti nel CLI

Il Command Line Interface di Angular ha ricevuto importanti aggiornamenti:

1. **Supporto nativo per Node.js 16**: ora Angular CLI supporta ufficialmente Node.js 16
2. **Rimozione del supporto per IE11**: Angular ora si concentra sui browser moderni
3. **Supporto per la persistenza della cache di Webpack**: build più veloci con la memorizzazione nella cache

```bash
# Nuovo comando per pulire la cache del CLI
ng cache clean

# Creare un nuovo progetto Angular 13
ng new my-app --strict
```

## Gestione delle dipendenze semplificata

Una delle novità più apprezzate è la rimozione della necessità di specificare la versione di TypeScript nelle dipendenze del progetto. Angular ora gestisce automaticamente la versione compatibile:

```json
// package.json più semplice
{
  "dependencies": {
    "@angular/core": "^13.0.0",
    "@angular/common": "^13.0.0",
    // TypeScript non deve più essere specificato qui
  }
}
```

## Nuova API per il rendering delle componenti

Angular 13 introduce una nuova API per il rendering dinamico dei componenti:

```typescript
@Component({
  selector: 'app-dynamic-rendering',
  template: '<div #container></div>'
})
export class DynamicRenderingComponent {
  @ViewChild('container', {read: ViewContainerRef}) container!: ViewContainerRef;
  
  loadComponent() {
    // Creazione dinamica migliorata in Angular 13
    const componentRef = this.container.createComponent(DynamicComponent);
    componentRef.instance.data = 'Dati passati dinamicamente';
  }
}
```

## Conclusioni e prospettive future

Angular 13 segna un passo importante nell'evoluzione del framework. Con l'adozione completa di Ivy e l'abbandono di tecnologie legacy, Angular si conferma una scelta affidabile e moderna per lo sviluppo di applicazioni enterprise.

Le novità introdotte migliorano notevolmente l'esperienza dello sviluppatore, con tipizzazione più stretta, API più intuitive e strumenti di build più efficienti.

Nei prossimi mesi ci aspettiamo ulteriori miglioramenti, soprattutto nell'ambito delle prestazioni e nella semplificazione dell'API. La roadmap futura sembra promettente, con un focus particolare sull'esperienza sviluppatore e sull'ottimizzazione delle prestazioni per applicazioni di grandi dimensioni.

Angular rimane una delle scelte principali per progetti aziendali che richiedono struttura, manutenibilità e scalabilità nel lungo periodo.
