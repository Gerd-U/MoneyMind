import { NavLink } from "react-router-dom";

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Movimientos', path: '/movimientos' },
  { label: 'Reportes', path: '/reportes' },
  { label: 'Presupuestos', path: '/budgets' },
  { label: 'Categorías', path: '/categorias' },
  { label: 'Métodos de pago', path: '/metodos-pago' },
  { label: 'Perfil', path: '/perfil' },
]

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  return (
    <aside
      style={{ backgroundColor: "#090F1A" }}
      className="w-64 min-h-screen flex flex-col px-4 py-6"
    >
      {/* Logo */}
      <div className="mb-10 px-2 flex items-center justify-between">
        <span
          style={{ color: "#3ecf8e" }}
          className="text-2xl font-bold tracking-tight"
        >
          Money<span className="text-white">Mind</span>
        </span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors lg:hidden"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              `px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
            style={({ isActive }) =>
              isActive ? { backgroundColor: "#101D32", color: "white" } : {}
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
