import { useState } from 'react';

function App() {
  // Estados para manejar la interfaz de confirmación
  const [mensajeExito, setMensajeExito] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);

  const handleConfirmarCita = () => {
    setCargando(true);
    setMensajeExito('');

    // Simulamos la respuesta del backend (la API propia que conecta con Resend)
    setTimeout(() => {
      setCargando(false);
      setMensajeExito('Correo enviado al cliente');
    }, 1500); // Tarda 1.5 segundos en responder
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-slate-900 text-white gap-6">
      <h1 className="text-4xl font-bold tracking-tight text-emerald-400">
        ¡SaaS Imperial Barber listo! ✂️💈
      </h1>

      <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 text-center max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-slate-200">Panel del Administrador</h2>
        <p className="text-sm text-slate-400 mb-6">Confirmación de la cita #1024</p>
        
        <button
          onClick={handleConfirmarCita}
          disabled={cargando}
          className={`w-full py-2 px-4 rounded font-medium transition-colors ${
            cargando 
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
              : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
          }`}
        >
          {cargando ? 'Procesando cita y correo...' : 'Confirmar Cita'}
        </button>

        {/* Muestra el mensaje exacto que te pidió tu equipo */}
        {mensajeExito && (
          <div className="mt-4 p-3 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded text-sm font-semibold animate-pulse">
            {mensajeExito}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;