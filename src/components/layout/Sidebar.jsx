const Sidebar = () => {
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
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <span>🏠</span> Inicio
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <span>🛒</span> Ventas
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <span>📦</span> Inventario
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <span>👥</span> Proveedores
            </a>
          </li>
        </ul>
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-slate-800">
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <span>⚙️</span> Configuración
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;