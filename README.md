# To-Do List VPS — CI/CD

SPA de gestión de tareas (CRUD completo + filtro en tiempo real) desplegada en un VPS propio (Google Cloud Compute Engine), con backend en Node.js/Express, base de datos PostgreSQL, servidor web Nginx como proxy reverso, y pipeline de despliegue continuo con GitHub Actions.

## Estructura del proyecto

```
todo-list-vps/
├── backend/              # API REST (Node.js + Express + PostgreSQL)
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── .env.example
├── public/                # Frontend SPA (HTML/CSS/JS)
│   ├── index.html
│   ├── style.css
│   └── app.js
├── deploy/                # Archivos de configuración del servidor
│   ├── nginx-todolist.conf
│   └── todolist-backend.service
└── .github/workflows/
    └── deploy.yml          # Pipeline CI/CD
```

## Stack

- **Servidor web**: Nginx (proxy reverso + servidor de archivos estáticos)
- **Servidor de aplicaciones**: Node.js + Express (API REST)
- **Base de datos**: PostgreSQL
- **CI/CD**: GitHub Actions (rsync vía SSH al hacer push a `main`)

## Despliegue

Ver bitácora completa en el informe. El pipeline se dispara automáticamente al hacer `push` a `main`.
