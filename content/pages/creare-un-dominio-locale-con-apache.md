---
author : "Angelo"
title : "Creare un virtual host con Apache su Ubuntu Linux"
date : "2020-08-04"
image : "/uploads/domain-apache/domain-apache.png"
type : 'pages'
draft : false
tags : [
    "Apache",
    "Webserver",
    "linux"
]
categories : [
    "Systems"
]
aliases : ["domain-apache"]
summary : "Apache è uno dei webserver più utilizzati, insieme ad Nginx detiene il 70% del mercato server. Vediamo come creare un virtual e configurarlo per utilizzarlo in locale per un ambiente di sviluppo"
---


[Apache](https://httpd.apache.org/) è indubbiamente uno dei webserver più diffusi nel mercato server insieme a [Nginx](https://www.nginx.com/), infatti stando alla data odierna di pubblicazione Agosto 2020 è [installato sul 36% dei server.](https://w3techs.com/technologies/overview/web_server).

Su ogni **server apache** è possibile eseguire più domini o virtual host, indirizzi che puntano semplicemente ad una cartella e ne leggono il contenuto secondo le istruzioni di configurazione; oltre che girare su un server in produzione, possiamo anche configurare il tutto per girare in un ambiente locale per lo sviluppo; ad esempio per un dominio nomeapp.com, in locale possiamo avere dominio *dev.nomeapp.com*.

In questo articolo vedremo come:
- creare un dominio su apache su Linux
- impostare una configurazione base del virtual host
- disabilitare il dominio

Se non ancora installato, dovremo avviare l'installazione di Apache:
```shell
sudo apt install apache2
```

## Come creare il virtual host

Inanzitutto occorre creare il file di configurazione, che per convenzione riporta il nome del dominio ed estensione .conf. Quindi da terminale lanciamo:
```shell
sudo nano /etc/apache2/sites-available/$NOME_SITO.com.conf
```

Lanciato questo comando, avremo il file aperto sull'editor nano, dove inseriremo questa configurazione, con le dovute personalizzazione rispetto al nome a dominio e i relativi percorsi
```apache
<VirtualHost *:80>
    ServerAdmin admin@test.com
    ServerName test.com
    ServerAlias www.test.com
    DocumentRoot /var/www/test.com/public_html
    ErrorLog /var/www/test.com/logs/error.log
    CustomLog /var/www/test.com/logs/access.log combined
</VirtualHost>
```

Lanciare da terminale il comando per abilitare il nome a dominio, e successivamente il riavvio del webserver
```shell
sudo a2ensite $NOME_SITO.com.conf
sudo service apache2 restart
```

Fin qui la parte di Apache è già concluso, ora dovremmo dire al server di puntare l'indirizzo locale al nuovo nome a dominio

Apriamo il file hosts
```shell
sudo nano /etc/hosts
```

E dentro il file ggiungere il nuovo dominio con indirizzo a locale 127.0.0.1
```shell
127.0.0.1   localhost
127.0.1.1   guest-desktop

127.0.0.1   $NOME_SITO.ext #aggiungere questa riga
```

### Come disabilitare il virtual host

Nel caso in cui volessimo per qualsiasi motivo disabilitare il dominio, ecco la procedura:

Entriamo dentro la directory di apache dove sono presenti tutti i file di configurazione:
```shell
cd /etc/apache2/sites-available/
```

lanciare da terminale
```shell
sudo a2dissite $NOME_SITO.com.conf
```

riavviare apache
```shell
sudo service apache2 restart
```

commentare la relativa riga sul file hosts
```shell
127.0.0.1   localhost
127.0.1.1   guest-desktop

#127.0.0.1  $NOME_SITO 
```

Nel post successivo vedremo come [creare un certificato ssl in locale ed abilitare https su localhost](/pages/creare-un-dominio-locale-con-apache/).