---
title: "React Class Components: guida completa"
date: 2019-06-15T14:20:00+02:00
draft: false
author: "Angelo"
type: 'pages'
tags: [
    "React",
    "JavaScript",
    "Frontend",
    "Class Components"
]
categories: [
    "Development"
]
summary: "Una guida completa ai Class Components di React: come strutturarli, gestire lo stato, usare lifecycle methods, e implementare pattern comuni per applicazioni React robuste e manutenibili."
---

## React Class Components nel 2019

Nel panorama dello sviluppo React del 2019, i Class Components rappresentano ancora l'approccio principale per creare componenti con stato e logica complessa. Anche se gli Hooks sono stati introdotti nella versione 16.8 a febbraio, molti sviluppatori e progetti esistenti continuano a utilizzare il paradigma dei Class Components per la loro robustezza e familiarità.

In questo articolo esploreremo in profondità i Class Components di React, imparando come trarre il massimo dalle loro caratteristiche e come implementare pattern comuni di sviluppo.

## Anatomia di un Class Component

Un Class Component estende `React.Component` e deve implementare almeno il metodo `render()`:

```jsx
import React, { Component } from 'react';

class UserProfile extends Component {
  render() {
    return (
      <div className="profile">
        <h2>{this.props.name}</h2>
        <p>{this.props.bio}</p>
      </div>
    );
  }
}

export default UserProfile;
```

## Gestione dello stato

Una delle caratteristiche principali dei Class Components è la capacità di gestire uno stato interno:

```jsx
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  increment = () => {
    this.setState(prevState => ({
      count: prevState.count + 1
    }));
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Incrementa</button>
      </div>
    );
  }
}
```

### Caratteristiche chiave di `this.setState()`

1. **Aggiornamenti asincroni**: `setState` non aggiorna immediatamente lo stato
2. **Aggiornamenti batch**: React può raggruppare più chiamate a `setState`
3. **Aggiornamenti parziali**: lo stato viene unito superficialmente (shallow merge)

```jsx
// Aggiornamento basato sullo stato precedente (affidabile)
this.setState(prevState => ({
  counter: prevState.counter + 1
}));

// Accesso allo stato aggiornato tramite callback
this.setState({count: 42}, () => {
  console.log('Stato aggiornato:', this.state.count);
});
```

## Lifecycle Methods 

I Class Components offrono un controllo granulare sul ciclo di vita del componente. Ecco i metodi principali disponibili nel 2019:

### Fase di Mounting

```jsx
class MountingExample extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    // Inizializzazione, ma non effetti collaterali
  }

  static getDerivedStateFromProps(props, state) {
    // Raramente usato - per derivare stato dalle props
    return null;
  }

  componentDidMount() {
    // Ideale per fetch API, sottoscrizioni, manipolazione DOM
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }

  render() {
    return <div>{/* rendering del componente */}</div>;
  }
}
```

### Fase di Updating

```jsx
class UpdatingExample extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    // Ottimizzazione delle performance
    return this.props.id !== nextProps.id;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Cattura informazioni pre-aggiornamento (es. posizione scroll)
    return { scrollPos: window.scrollY };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Operazioni dopo l'aggiornamento del componente
    if (prevProps.userId !== this.props.userId) {
      this.fetchUserData(this.props.userId);
    }
    
    // Uso dello snapshot
    if (snapshot && snapshot.scrollPos) {
      window.scrollTo(0, snapshot.scrollPos);
    }
  }

  render() {
    return <div>{/* rendering del componente */}</div>;
  }
}
```

### Fase di Unmounting

```jsx
class UnmountingExample extends Component {
  componentWillUnmount() {
    // Pulizia: cancellare timer, sottoscrizioni, ecc.
    document.removeEventListener('click', this.handleClick);
    clearInterval(this.interval);
  }
}
```

## Pattern avanzati con Class Components

### Higher-Order Components (HOC)

```jsx
// Higher-Order Component per aggiungere funzionalità di logging
function withLogging(WrappedComponent) {
  return class extends Component {
    componentDidMount() {
      console.log(`Component ${WrappedComponent.name} mounted`);
    }
    
    componentWillUnmount() {
      console.log(`Component ${WrappedComponent.name} will unmount`);
    }
    
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

// Utilizzo dell'HOC
const EnhancedComponent = withLogging(UserProfile);
```

### Render Props

```jsx
class MouseTracker extends Component {
  state = { x: 0, y: 0 };
  
  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }
  
  render() {
    return (
      <div onMouseMove={this.handleMouseMove} style={{ height: '100vh' }}>
        {/* Passa lo stato come function prop */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

// Utilizzo
<MouseTracker 
  render={({ x, y }) => (
    <h1>Il mouse è alla posizione: {x}, {y}</h1>
  )}
/>
```

### Ref e DOM

```jsx
class AutoFocusInput extends Component {
  constructor(props) {
    super(props);
    // Creazione ref
    this.inputRef = React.createRef();
  }
  
  componentDidMount() {
    // Accesso al DOM node
    this.inputRef.current.focus();
  }
  
  render() {
    return <input ref={this.inputRef} />;
  }
}
```

## Gestione degli errori

I Class Components offrono meccanismi dedicati per la gestione degli errori:

```jsx
class ErrorBoundary extends Component {
  state = { hasError: false, errorInfo: null };
  
  static getDerivedStateFromError(error) {
    // Aggiorna lo stato in modo che il prossimo render mostri l'UI di fallback
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // Puoi registrare l'errore in un servizio di reporting
    console.error("Errore catturato:", error, errorInfo);
    this.setState({ errorInfo });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Qualcosa è andato storto.</h2>
          <details>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Utilizzo
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

## Considerazioni sulle performance

Per ottimizzare le performance dei Class Components:

1. **Usare `shouldComponentUpdate`** per prevenire rendering non necessari
2. **Implementare `React.PureComponent`** per confronti superficiali automatici
3. **Memorizzare handler di eventi** per prevenire creazioni inutili di funzioni

```jsx
class OptimizedComponent extends React.PureComponent {
  // Metodi memorizzati come proprietà di classe usando arrow functions
  handleClick = () => {
    this.setState({ clicked: true });
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.props.label}
      </button>
    );
  }
}
```

## Conclusione e prospettive future

I Class Components sono stati la colonna portante dello sviluppo React fino al 2019. Con l'introduzione degli Hooks, React sta prendendo una nuova direzione, ma la comprensione dei Class Components rimane fondamentale per:

- Manutenzione di codice esistente
- Comprensione dei pattern React fondamentali
- Casi d'uso specifici dove i Class Components potrebbero ancora brillare

Nel prossimo futuro, ci aspettiamo di vedere una graduale migrazione verso gli Hooks, ma la conoscenza dei Class Components rimarrà preziosa ancora per molto tempo, specialmente nei progetti enterprise di grandi dimensioni dove la migrazione sarà più lenta.

I Class Components continueranno a essere supportati da React anche con l'avvento degli Hooks, quindi non c'è fretta di migrare il codice esistente, ma è bene iniziare a familiarizzare con il nuovo paradigma per i nuovi sviluppi.
