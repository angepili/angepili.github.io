---
author : "Angelo"
title : "Abilitare https su Apache in locale"
date : "2020-09-23"
image : "/uploads/domain-apache-https/domain-apache-https.png"
type : 'pages'
draft : true
tags : [
    "Apache",
    "Webserver",
    "linux"
]
categories : [
    "Systems"
]
aliases : ["domain-apache-https"]
summary : "Dopo aver visto come creare un virtual host con Apache, oggi vediamo come abilitarne anche l'https in locale per lavorare in una ambiente di sviluppo completo."
---

Dopo aver visto [come creare un virtual host apache su ubuntu](/pages/creare-un-dominio-locale-con-apache/), vediamo come abilitare https in locale per l'ambiente di sviluppo.

Chiariamo fin da subito che https in locale non è necessario per problemi di sicurezza, ma potrebbe essere utile per replicare in toto l'ambiente di produzione, sopratutto per quei servizi di terze parti che eseguono un controllo sul dominio.

Dobbiamo inanzitutto andare a modifiche il file di configurazione Apache chiamato default-ssl.conf. Da terminale:
```shell
sudo nano /etc/apache2/sites-available/default-ssl.conf
```

Ed andiamo a copiare il codice qui di seguito, subito prima del tag di chiusura `</IfModule>` e salviamo.

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

Ora, il **modulo ssl** è già disponibile di default su ubuntu, ma deve essere abilitato, quindi da terminale lanciare:

```shell
sudo a2enmod ssl
```

Adesso dobbiamo andare a generare i certificati dentro una cartella di Apache, esattamente quelli che abbiamo già indicato sopra ai valori *SSLCertificateFile* e *SSLCertificateKeyFile*. Quindi creiamo la cartella che andrà ad ospirarli:

```shell
mkdir /etc/apache2/ssl 
```

Installiamo, se non lo avessimo già, il pacchetto openssl:
```shell
sudo apt install openssl
```

Ed ora abbiamo tutto quanto per creare i certificati per abilitare https su Apache,  quindi lanciamo:
```shell
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/apache2/ssl/apache.key -out /etc/apache2/ssl/apache.crt
```

Ci verranno chiesti alcune informazioni:
```shell
Country Name (2 letter code) [AU]:
State or Province Name (full name) [Some-State]:
Locality Name (eg, city) []:
Organization Name (eg, company) [Internet Widgits Pty Ltd]:
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:
Email Address []:
```

Non ci resta che attivare il tutto, e riavviare il nostro **webserver Apache**:

```shell
sudo a2ensite /etc/apache2/sites-available/default-ssl.conf
sudo service apache2 restart
```

Ora dovremmo poter raggiungere il nostro host all'indirizzo https://test.com, in caso contrario proviamo a chiudere la sessione e riavviare per evitare problemi di cache. 

Tuttavia iIl browser ora potrebbe comunque comunicarci che il certificato ssl non è sicuro, nessun problema, occorre semplicemente accettare i rischi e proseguire.

Ovviamente se abbiamo la necessità di farlo per altri domini successivamente, possiamo semplicemente replicare tutto il blocco racchiuso tra i tag `<VirtualHost>`  nello stesso file default-ssl.conf, cambiando solo i riferimenti appunto del dominio (ex: test.com nel file di esempio, e le rispettive directory), e poi riavviare il server.

<!--
cd /usr/local/
sudo git clone https://github.com/letsencrypt/letsencrypt
cd letsencrypt
sudo ./letsencrypt-auto --apache -d testing.performahrm.com
-->