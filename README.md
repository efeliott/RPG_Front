
# Initialisation du projet React TypeScript avec Vite

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :
- Node.js (version 14 ou supérieure)
- npm (ou yarn)

## Étapes d'initialisation

1. **Cloner le projet depuis GitHub**

   Clonez le dépôt GitHub dans votre répertoire local en exécutant la commande suivante dans votre terminal :

   ```bash
   git clone <URL_du_dépôt>
   ```

2. **Accéder au répertoire du projet**

   Allez dans le répertoire du projet cloné :

   ```bash
   cd <nom_du_répertoire>
   ```

3. **Installer les dépendances**

   Le fichier `package.json` contient toutes les dépendances nécessaires. Pour les installer, exécutez la commande suivante :

   ```bash
   npm install
   ```

   Cela installera toutes les dépendances listées dans `dependencies` et `devDependencies`, y compris :
   - React
   - Vite
   - TypeScript
   - TailwindCSS
   - Material UI
   - et d'autres outils essentiels

4. **Démarrer le serveur de développement**

   Une fois l'installation des dépendances terminée, vous pouvez lancer le projet en mode développement avec la commande suivante :

   ```bash
   npm run dev
   ```

   Cela démarrera un serveur de développement local accessible sur `http://localhost:3000` (ou un autre port indiqué dans le terminal).

5. **Compiler pour la production**

   Si vous souhaitez compiler le projet pour un environnement de production, exécutez la commande :

   ```bash
   npm run build
   ```

   Les fichiers générés seront placés dans le dossier `dist`.

6. **Aperçu de la version de production**

   Pour visualiser la version de production après la compilation, exécutez :

   ```bash
   npm run preview
   ```

   Cela lancera un serveur local pour afficher l'application compilée.

## Problèmes potentiels

Si vous rencontrez des erreurs, assurez-vous que :
- Toutes les dépendances sont installées correctement avec `npm install`.
- Vous utilisez une version compatible de Node.js.
