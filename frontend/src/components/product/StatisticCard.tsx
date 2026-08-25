import { Card } from '../ui/Card';

interface StatisticCardProps {
  label: string;
  value: string;
  detail: string;
}

export const StatisticCard = ({ label, value, detail }: StatisticCardProps) => {
  return (
    <Card className="min-h-32">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-[#1ed760]">{detail}</p>
    </Card>
  );
};
