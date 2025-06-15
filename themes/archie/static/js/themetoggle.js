/**
 * Gestisce il tema chiaro/scuro e rileva le preferenze di sistema
 */

// Rileva le preferenze del sistema operativo
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Funzione per rilevare cambiamenti nelle preferenze del sistema
function listenForThemeChange() {
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (event) => {
            // Solo se non è stato impostato manualmente un tema, segui il sistema
            if (!localStorage.getItem("theme-storage") || localStorage.getItem("theme-storage") === "auto") {
                setTheme(event.matches ? "dark" : "light", true);
            }
        });
    }
}

function setTheme(mode, isSystemPreference = false) {
    // Se è una preferenza di sistema e l'utente ha impostato manualmente il tema, non fare nulla
    if (isSystemPreference && localStorage.getItem("theme-storage") && 
        localStorage.getItem("theme-storage") !== "auto") {
        return;
    }
    
    // Salva l'impostazione solo se non è una preferenza di sistema
    if (!isSystemPreference) {
        localStorage.setItem("theme-storage", mode);
    }
    
    // Prendi i riferimenti agli elementi DOM
    const darkModeStyle = document.getElementById("darkModeStyle");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    
    if (mode === "dark") {
        // Applica la modalità scura
        if (darkModeStyle) darkModeStyle.disabled = false;
        if (darkModeToggle) darkModeToggle.innerHTML = "<i class=\"icon-sun\">☀️</i>";
        
        // Aggiungi una classe darkmode al body come fallback
        document.body.classList.add('darkmode');
    } else if (mode === "light") {
        // Applica la modalità chiara
        if (darkModeStyle) darkModeStyle.disabled = true;
        if (darkModeToggle) darkModeToggle.innerHTML = "<i class=\"icon-moon\">🌙</i>";
        
        // Rimuovi la classe darkmode dal body
        document.body.classList.remove('darkmode');
    } else if (mode === "auto") {
        // Utilizza le preferenze del sistema
        setTheme(prefersDarkMode ? "dark" : "light", true);
    }
}

function toggleTheme() {
    const currentTheme = localStorage.getItem("theme-storage") || "auto";
    
    // Cicla tra light, dark, auto
    if (currentTheme === "light") {
        setTheme("dark");
    } else if (currentTheme === "dark") {
        setTheme("auto");
    } else {
        setTheme("light");
    }
}

// Attendere che il DOM sia completamente caricato
document.addEventListener('DOMContentLoaded', function() {
    // Recupera il tema salvato o usa "auto" come default per seguire le preferenze del sistema
    const savedTheme = localStorage.getItem("theme-storage") || "auto";
    
    // Applica il tema
    setTheme(savedTheme);
    
    // Attiva l'ascolto per i cambiamenti delle preferenze del sistema
    listenForThemeChange();
    
    // Controllo di supporto tema
    if (document.getElementById("darkModeStyle") === null && 
        document.getElementById("dark-mode-toggle") !== null) {
        console.warn("Tema scuro abilitato ma manca l'elemento con id 'darkModeStyle'. Verifica il file scss/dark.html.");
    }
    
    // Aggiorna il pulsante toggle per mostrare l'icona corretta
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (darkModeToggle) {
        if (savedTheme === "auto") {
            darkModeToggle.innerHTML = "<i class=\"icon-auto\">🔄</i>";
        }
    }
});
