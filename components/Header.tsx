export default function Header() {
  return (
    <header className="w-full py-6 px-6 md:px-20 border-b border-slate-400 flex justify-between items-center bg-white">
      {/* Logo ou Nome do App */}
      <div className="text-xl font-bold tracking-tight text-slate-900">
        Compasso
      </div>

      {/* Navegação */}
      <nav className="flex gap-6">
        <a href="/escalas" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          Escalas
        </a>
        <a href="/login" className="text-sm font-medium text-slate-900 hover:text-slate-600 transition-colors">
          Login
        </a>
      </nav>
    </header>
  );
}