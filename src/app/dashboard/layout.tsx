export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Barra Lateral */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h2 className="text-xl font-bold mb-10">Compasso</h2>
        <nav className="space-y-4">
          <a href="/dashboard" className="block hover:text-blue-400">Início</a>
          <a href="/dashboard/escalas" className="block hover:text-blue-400">Escalas</a>
          <a href="/dashboard/ministros" className="block hover:text-blue-400">Equipe de voluntários</a>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}