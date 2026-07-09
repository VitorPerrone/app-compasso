import TabelaEscalas from "@/components/TabelaEscalas";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Próximas Escalas</h1>
      <p className="text-gray-600">Gestão rápida dos seus próximos eventos.</p>
      
      <TabelaEscalas />
    </div>
  );
}