import { useTheme } from "@/context/ThemeContext";

export default function PortalCard({ title, icon, children, color = "primary" }) {
  const theme = useTheme();

  return (
    <div
      className="rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
      style={{ background: theme.colors[color], color: theme.colors.neutral }}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-sm">{children}</p>
    </div>
  );
}
