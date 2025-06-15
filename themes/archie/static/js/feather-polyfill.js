/**
 * Feather Icons polyfill
 * Questo script fornisce un oggetto `feather` minimale per evitare errori quando
 * il file feather.min.js è stato rimosso ma alcune pagine ancora lo utilizzano.
 */
window.feather = {
    // Funzione replace vuota che non fa nulla
    replace: function() {
        console.log('Feather Icons è stato disattivato. Usando il polyfill.');
        return;
    },
    // Oggetto icons vuoto per evitare errori
    icons: {}
};
