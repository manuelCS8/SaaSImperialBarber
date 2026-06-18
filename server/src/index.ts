import app from './app';

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });
}
