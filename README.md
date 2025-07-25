# Lovvami - Dating Web App

## Descrizione del progetto

**LOVVAMI** è una moderna dating app che offre un'esperienza completa per trovare l'anima gemella. L'applicazione combina un design intuitivo con funzionalità avanzate per creare connessioni autentiche tra gli utenti.

Il cuore dell'app ruota attorno al classico sistema di **swipe** per scoprire nuovi profili, permettendo agli utenti di esprimere interesse con un semplice gesto. Quando due persone si piacciono reciprocamente, nasce un **match** che sblocca la possibilità di iniziare una conversazione attraverso il sistema di **chat integrato**.

L'app presenta un' **interfaccia pulita e responsive**, ottimizzata sia per dispositivi mobile che desktop, garantendo un'esperienza fluida su qualsiasi piattaforma. Il sistema di **preferenze avanzate** permette di filtrare i potenziali match per età, distanza geografica e altri criteri personalizzabili.

Una caratteristica è il **sistema di disattivazione temporanea** dell'account, che consente agli utenti di prendersi una pausa dall'app mantenendo tutti i propri dati e conversazioni al sicuro.

La sicurezza è una priorità: ogni utente deve **verificare la propria email** prima di poter utilizzare l'app, e il sistema di autenticazione garantisce la protezione dei dati personali. L'architettura modulare e scalabile rende l'app pronta per crescere e adattarsi alle esigenze future.

## ARCHITETTURA TECNICA

### **[Frontend - Angular](./FEATURES.md)** _(Sviluppo principale)_

- **Framework**: Angular 20.0.2 con TypeScript
- **State Management**: Angular Signals per reattività ottimale
- **Routing**: Angular Router con lazy loading e guard di protezione
- **Architettura**: Componenti modulari e riutilizzabili
- **Styling**: CSS custom responsive con design mobile-first

### **[Backend - Spring Boot](https://github.com/sabrinacinque/dateAppBack.git)** _(Sviluppato dal team backend)_

- Framework Spring Boot con API REST
- Sistema di autenticazione JWT e verifica email
- Database relazionale con architettura scalabile
- Algoritmi di matching personalizzati

## GETTING STARTED

### Installa le dipendenze

```bash
npm install
```

### Avvia l'app

```bash
ng serve
```

## DEMO

Esplora l’app per testare l’interfaccia responsive e provare le funzionalità in tempo reale.

[MVP](https://lovvami.netlify.app)
