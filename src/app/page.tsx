import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      {/* Container Principal Centralizado */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-20">
        
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-4xl w-full">
          
          {/* Coluna 1: Ícone */}
          <div className="shrink-0">
            <img 
              src="/musical-note.png" 
              alt="Nota Musical" 
              className="w-24 h-24 md:w-32 md:h-32 opacity-90" 
            />
          </div>

          {/* Linha Divisória */}
          <div className="hidden md:block w-px h-32 bg-slate-300"></div>

          {/* Coluna 2: Títulos e Botões */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 mb-4">
              Compasso
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 mb-10">
              Organização precisa para o seu ministério.
            </p>

            <div className="flex flex-col md:flex-row items-center md:justify-start gap-4">
              <a 
                href="/registro" 
                className="bg-slate-900 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-slate-800 transition-all shadow-lg w-full md:w-auto text-center"
              >
                Comece já
              </a>
              <a 
                href="/login" 
                className="text-slate-500 hover:text-slate-900 transition-colors underline underline-offset-4"
              >
                Entrar
              </a>
            </div>
          </div>
          
        </div>
      </section>
    </main>
  );
}