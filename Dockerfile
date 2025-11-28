# Basisimage mit Node.js
FROM node:20

# Arbeitsverzeichnis setzen
WORKDIR /app

# package.json und package-lock.json kopieren
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

# Restlichen Code kopieren
COPY . .

# Für Entwicklung: Devserver starten (Hot-Reload)
CMD ["npm", "run", "dev"]

# Port freigeben
EXPOSE 5173
