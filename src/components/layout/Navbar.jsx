const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Título de sección */}
      <div className="text-gray-700 font-medium">
        ERP / Panel de Control
      </div>

      {/* Acciones de usuario */}
      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <span>🔔</span>
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Perfil de Usuario */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer">
          <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
            MM
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-semibold text-gray-700 leading-none">Mario Munera</p>
            <p className="text-xs text-gray-500 mt-1">Administrador</p>
          </div>
          <span className="text-gray-400 text-xs">▼</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;