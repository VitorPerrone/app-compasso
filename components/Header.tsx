import Header from '../components/Header';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      {/* Container Principal */}
      <section className="flex-1 flex flex-col justify-center px-6 md:px-20 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Ícone à esquerda */}
          <div className="shrink-0">
            <img 
              src="/musical-note.png" 
              alt="Nota Musical" 
              className="w-24 h-24 md:w-32 md:h-32 opacity-90" 
            />
          </div>

          {/* Título e Subtítulo à direita */}
          <div className="text-left md:text-right flex-1 border-l-4 md:border-l-0 md:border-r-4 border-slate-900 pl-6 md:pl-0 md:pr-6">
            <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-slate-900">
              Compasso
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 whitespace-nowrap">
              Organização precisa para o seu ministério. Escalas simplificadas em tempo real.
            </p>
          </div>
          
        </div>
      </section>
    </main>
  );
}