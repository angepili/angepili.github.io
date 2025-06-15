/**
 * Script per bloccare specificamente le chiamate a https://apps.rokt.com/v1/errors
 */
(function() {
    // Sovrascrivi il metodo fetch nativo
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === 'string' && url.includes('apps.rokt.com/v1/errors')) {
            console.log('Bloccata chiamata fetch a:', url);
            return Promise.resolve(new Response('{"success":true}', {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }));
        }
        return originalFetch.apply(this, arguments);
    };

    // Sovrascrivi XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        if (typeof url === 'string' && url.includes('apps.rokt.com/v1/errors')) {
            console.log('Bloccata chiamata XHR a:', url);
            // Reindirizza verso un endpoint vuoto
            url = 'data:text/plain,{"success":true}';
        }
        return originalXHROpen.call(this, method, url, ...rest);
    };

    // Intercetta i script errors (spesso sono questi che generano le chiamate a v1/errors)
    window.addEventListener('error', function(event) {
        // Previeni che errori relativi a rokt vengano riportati
        if (event && event.filename && event.filename.includes('rokt.com')) {
            event.preventDefault();
            event.stopPropagation();
            console.log('Bloccato error event per script rokt.com');
            return false;
        }
    }, true);

    // Intercetta anche le promise non gestite
    window.addEventListener('unhandledrejection', function(event) {
        // Il valore di una promise non gestita potrebbe essere qualsiasi cosa
        // Questo è un approccio generico per prevenire errori
        const error = event.reason;
        if (error && (
            (error.stack && error.stack.includes('rokt.com')) || 
            (error.message && error.message.includes('rokt.com'))
        )) {
            event.preventDefault();
            event.stopPropagation();
            console.log('Bloccato rejection event per script rokt.com');
            return false;
        }
    }, true);

    console.log('Protezione anti-rokt v1/errors attivata');
})();
