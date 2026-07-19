import app from './app';
import { prepareDatabaseInBackground } from './lib/prepareDatabase';

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  prepareDatabaseInBackground();

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });
}
