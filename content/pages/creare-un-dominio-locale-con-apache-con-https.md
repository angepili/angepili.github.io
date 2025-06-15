---
author : "Angelo"
title : "Abilitare HTTPS su Apache in ambiente locale"
date : "2020-09-23"
image : "/uploads/domain-apache-https/domain-apache-https.png"
type : 'pages'
draft : false
tags : [
    "Apache",
    "Webserver",
    "HTTPS",
    "SSL",
    "Linux",
    "macOS"
]
categories : [
    "Systems",
    "DevOps"
]
aliases : ["domain-apache-https"]
summary : "Dopo aver visto come configurare virtual host con Apache, scopriamo come abilitare HTTPS in ambiente locale per replicare completamente un ambiente di produzione sicuro."
---

Nel precedente articolo abbiamo visto [come creare un virtual host Apache su Linux](/pages/creare-un-dominio-locale-con-apache/). Oggi proseguiamo configurando HTTPS in locale per avere un ambiente di sviluppo ancora più completo.

## Perché configurare HTTPS in locale?

Configurare HTTPS in ambiente locale non è generalmente necessario per motivi di sicurezza, ma offre diversi vantaggi:

- Replica fedele dell'ambiente di produzione
- Test di funzionalità che richiedono connessioni sicure (come l'API Geolocation)
- Compatibilità con servizi di terze parti che richiedono HTTPS
- Prevenzione di problemi di sviluppo legati al contesto di sicurezza misto

## Configurazione di SSL su Apache

Iniziamo modificando il file di configurazione SSL di Apache. Su sistemi basati su Ubuntu/Debian, eseguiamo:

```shell
sudo nano /etc/apache2/sites-available/default-ssl.conf
```

Su macOS con Homebrew, il percorso sarà diverso:

```shell
sudo nano /usr/local/etc/httpd/extra/httpd-ssl.conf
```

Indichiamo al file di configurazione SSL come gestire il nostro dominio locale. Aggiungiamo questa configurazione all'interno del file, prima del tag di chiusura `</IfModule>` (se presente):

```apache
    <VirtualHost _default_:443>
        ServerAdmin admin@test.com
        ServerName test.com

        DocumentRoot /var/www/test.com/public_html

        <Directory /var/www/test.com/public_html>
                Options Indexes FollowSymLinks MultiViews
                AllowOverride All
                Order allow,deny
                allow from all
                Require all granted
        </Directory>

        ErrorLog ${APACHE_LOG_DIR}/test-com-error.log
        CustomLog ${APACHE_LOG_DIR}/test-com-access.log combined

        SSLEngine on

        SSLCertificateFile /etc/apache2/ssl/apache.crt
        SSLCertificateKeyFile /etc/apache2/ssl/apache.key

        <FilesMatch "\.(cgi|shtml|phtml|php)$">
                        SSLOptions +StdEnvVars
        </FilesMatch>
        <Directory /usr/lib/cgi-bin>
                        SSLOptions +StdEnvVars
        </Directory>

        BrowserMatch "MSIE [2-6]" \
                       nokeepalive ssl-unclean-shutdown \
                       downgrade-1.0 force-response-1.0

    </VirtualHost>
```

## Abilitazione del modulo SSL

Il modulo SSL potrebbe essere già disponibile ma non attivato. Su Ubuntu/Debian, attiviamolo:

```shell
sudo a2enmod ssl
```

Su macOS, dovremo modificare il file di configurazione principale per abilitare SSL:

```shell
sudo nano /usr/local/etc/httpd/httpd.conf
```

E scommentare (rimuovendo il `#` all'inizio) la riga:

```apache
#LoadModule ssl_module libexec/apache2/mod_ssl.so
```

## Generazione dei certificati SSL autofirmati

Ora dobbiamo generare i certificati SSL autofirmati. Prima creiamo la directory che li conterrà:

### Linux (Ubuntu/Debian)
```shell
sudo mkdir -p /etc/apache2/ssl
```

### macOS
```shell
sudo mkdir -p /usr/local/etc/httpd/ssl
```

Assicuriamoci di avere OpenSSL installato:

```shell
# Ubuntu/Debian
sudo apt install openssl

# macOS
brew install openssl
```

Generiamo i certificati (adattare il percorso in base al sistema operativo):

```shell
# Ubuntu/Debian
sudo openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout /etc/apache2/ssl/apache.key -out /etc/apache2/ssl/apache.crt

# macOS
sudo openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout /usr/local/etc/httpd/ssl/apache.key -out /usr/local/etc/httpd/ssl/apache.crt
```

> **Nota**: Abbiamo aumentato la validità del certificato a 10 anni (3650 giorni) per evitare di doverlo rigenerare frequentemente in ambiente di sviluppo.

Durante la generazione del certificato, vi verrà chiesto di inserire alcune informazioni. Ecco come compilarle:

```shell
Country Name (2 letter code) [AU]: IT
State or Province Name (full name) [Some-State]: Lombardia
Locality Name (eg, city) []: Milano
Organization Name (eg, company) [Internet Widgits Pty Ltd]: Local Development
Organizational Unit Name (eg, section) []: Development
Common Name (e.g. server FQDN or YOUR name) []: test.com
Email Address []: admin@test.com
```

> **Importante**: Nel campo "Common Name" inserite esattamente il nome del dominio locale che userete.

## Attivazione della configurazione SSL

Ora attiviamo la configurazione e riavviamo il server Apache:

### Linux (Ubuntu/Debian)
```shell
sudo a2ensite default-ssl.conf
sudo systemctl restart apache2
```

### macOS
```shell
sudo apachectl -k restart
```

## Test della configurazione

Ora dovremmo poter accedere al nostro sito tramite HTTPS:

```
https://test.com
```

Il browser mostrerà un avviso di sicurezza perché stiamo utilizzando un certificato autofirmato. In ambiente di sviluppo possiamo tranquillamente procedere cliccando su "Avanzate" e poi "Procedi su test.com (non sicuro)".

## Aggiungere altri domini

Se abbiamo bisogno di aggiungere altri domini con HTTPS, dobbiamo:

1. Replicare il blocco `<VirtualHost>` nel file di configurazione SSL
2. Modificare il ServerName e il DocumentRoot per il nuovo dominio
3. Riavviare Apache

## Configurazione avanzata

Per un'esperienza di sviluppo ancora migliore, possiamo:

1. **Aggiungere il certificato alle eccezioni del browser** - Così non vedremo più gli avvisi di sicurezza
2. **Configurare la redirezione automatica da HTTP a HTTPS**:

```apache
<VirtualHost *:80>
    ServerName test.com
    Redirect permanent / https://test.com/
</VirtualHost>
```

3. **Abilitare HTTP/2 per prestazioni migliori**:

```apache
<VirtualHost _default_:443>
    ...
    Protocols h2 http/1.1
    ...
</VirtualHost>
```

## Conclusione

Abbiamo configurato con successo HTTPS su Apache in ambiente locale, permettendoci di sviluppare applicazioni che richiedono connessioni sicure. Questo setup replica fedelmente un ambiente di produzione, aiutando a prevenire sorprese quando si passa dal test alla produzione.

Questo approccio è ideale per sviluppare applicazioni moderne che utilizzano API sensibili o servizi di terze parti che richiedono HTTPS.