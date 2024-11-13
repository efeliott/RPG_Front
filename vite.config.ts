import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Configuration pour diviser le code en chunks spécifiques
        manualChunks: {
          vendor: ['react', 'react-dom'], // Crée un chunk séparé pour les dépendances principales
        },
      },
    },
    // Optionnel : ajustez la limite d'avertissement de taille de chunk
    chunkSizeWarningLimit: 1000, // Par exemple, augmentez la limite à 1000 kB
  },
});
