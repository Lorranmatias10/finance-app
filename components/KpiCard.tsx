interface KpiCardProps {
  label: string
  value: number
  color?: 'green' | 'red' | 'blue'
}

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export default function KpiCard({ label, value, color = 'blue' }: KpiCardProps) {
  const colorClass = { green: 'text-green-600', red: 'text-red-600', blue: 'text-blue-600' }[color]

  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className={`text-2xl font-bold ${colorClass}`}>{formatBRL(value)}</span>
    </div>
  )
}
