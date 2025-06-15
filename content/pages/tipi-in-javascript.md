---
title: "I tipi di dati in Javascript"
date: 2020-10-03T00:45:33+02:00
draft: false
author : "Angelo"
type : 'pages'
tags : [
    "Javascript"
]
categories : [
    "Development"
]
summary : "Cos'è un valore di tipo numero, una stringa, o cos'è undefined? Andiamo ad analizzire quali sono i tipi di dato in javascript, e come usarli."
---

Come qualsiasi altro linguaggio, anche javascript prevede i tipi di dato: ovvero quell'informazione che ci dice che cos'è quel dato.

**Vanilla Javascript**, ovvero javascript è anzitutto un linguaggio a tipizzazione debole o tipizzazione dinamica, questo vuo dire che quando si assegna una variabile non è vincolante conoscerne il tipo, e può anche essere riassegnata cambiandone il tipo, senza creare problemi in fase di interpretazione. Sembrerebbe una comodità, ma può rivelarsi un'arma a doppio taglio per lo sviluppatore, infatti le best practice ci indicano che è sempre meglio conoscere che tipo di dato ci dobbiamo aspettiamo. Negli ultimi anni è nato **Typescript**, un super set di javascript che oltre a rendere disponibili nuove funzionalità, risolve anche questo problema introducendo la tipizzazione.

**Javascript** ha cinque tipi primitivi, ed uno complesso. Vediamo quindi quali sono e come si caraterizzano.

## I tipi primtivi
|type|descrizione|
|----|-----------|
|string|una sequenza di caratteri alfanumerici, quindi può contenere sia lettere che numeri; può contenere caratteri speciali, caratteri unicode, ed è delimitata da doppi o singoli apici.|

```js
// Esempio di string
var name = "Angelo"; // solo lettere
var username = "Angelo86" // lettere e numeri
var message = 'L\'apostrofo'; // se usiamo i singoli apici, ed abbiamo un'apostrofo, usare backslash + apostrofo
``` 

&nbsp;

|type|descrizione|
|----|-----------|
|number|al contrario di altri linguaggi, tipo C# che ha diversi tipi per il formato numero, in javascript l'unico messo a disposizione è number. Può contenere numeri positivi, negativi, 0, interi e decimali.|
```js
// Esempio di number
var year = 1986
var dec = 2.5
var negative = -7
```

&nbsp;

|type|descrizione|
|----|-----------|
|booleano|come negli altri linguaggi, un valore booleano può essere `true` e `false`. E' quindi un'entità logica per confermare o negare.|
```js
// Esempio di booleano
var hasUser = true
var hasLogged = false
```

&nbsp;

|type|descrizione|
|----|-----------|
|undefined|è quel tipo per cui una variabile anche se è stata inizializzata, non ha nessun valore|
```js
// Esempio di undefined
var lastname; // undefined
```

&nbsp;

|type|descrizione|
|----|-----------|
|null|quando decidiamo che una variabile non ha ancora un valore possibile|

```js
// Esempio di null
var activated = null;
```

## L'oggetto

|type|descrizione|
|----|-----------|
|object|è un tipo che possiamo definire complesso; è sostanzialmente un container di più dati su base chiave valore. Può contenere quindi diversi tipi di dati, assegnati grazie ad una chiave, divisi per virgola.|
```js
var Person = {
    name : "Angelo",
    year : 1986,
    hasLogged : false,
    activated : null,
    getAge : () => age,
    cities : ['Milan','Rome','London']
}
```

In javascript vengono definiti object anche le `function` e gli `array`

## Come verificare il tipo con Typeof
Per capire con che tipo di dato abbiamo a che fare, possiamo utilizzare l'operatore typeof, in `if statement` o semplicemente stampandolo su un console.log.
```js
typeof name // string
typeof year // number
typeof lastname // "undefined"
typeof activated // null
typeof Person // object

typeof function(){} // function
typeof ['a','b','c'] // object
```


Come accennato sopra, le funzioni sono degli oggetti, anche se facendo un typeof viene restituito `function`: qui una [spiegazione sulla doc ufficiale di ECMAScript](http://www.ecma-international.org/ecma-262/7.0/index.html#sec-properties-of-the-function-prototype-object)

## Nullish
Possiamo definie **nullish** tutti quei tipi e valori che portano a qualcosa di nullo o vuoto. Quindi possiamo raccogliere in questo gruppo: `null`, `undefined`, `0`, `[]`, `""`, `false`.

## Cambiare il tipo

Stringa > Numero
```js
num = +num;
typeof num // "number"
```

Numero > Booleano
```js
let checked = !0; // true
typeof checked // boolean
// O
let checked = !1 // false
typeof checked // boolean
```

Numero > Stringa
```js
let eta = 18 //
typeof eta // number

eta += ""; // "18"
typeof eta // "string"
```

Booleano > Numero
```js
console.log(+true) // 1
typeof +true // boolean
```