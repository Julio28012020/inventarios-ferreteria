import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  // Función auxiliar para saber qué ruta está activa y cambiarle el color de fondo
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen">
      {/* Branding / Logo */}
      <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800">
        <span className="text-xl font-bold text-white tracking-wide">
          🔨 EL CLAVO AZUL
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          <li>
            <Link
              to="/"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>🏠</span> Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/inventario/productos"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/inventario/productos') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>📦</span> Inventario (Productos)
            </Link>
          </li>
          <li>
            <span className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 cursor-not-allowed">
              <span>🛒</span> Ventas (Próximamente)
            </span>
          </li>
          <li>
            <span className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 cursor-not-allowed">
              <span>👥</span> Proveedores (Próximamente)
            </span>
          </li>
        </ul>
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-slate-800">
        <span className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 cursor-not-allowed">
          <span>⚙️</span> Configuración
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;