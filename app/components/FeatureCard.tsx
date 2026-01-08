export interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  desc: string;
}

export default function FeatureCard({ icon, title, desc }: Readonly<FeatureCardProps>) {
  return (
    <div className="p-6 rounded-xl bg-base-200 border border-base-300 shadow-md hover:shadow-lg transition-shadow duration-300">
      {icon && (
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary text-xl">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-base-content mb-2">{title}</h3>
      <p className="text-base-content/70 leading-relaxed">{desc}</p>
    </div>
  );
}
