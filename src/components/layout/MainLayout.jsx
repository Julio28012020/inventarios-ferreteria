import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Barra lateral fija */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra superior fija */}
        <Navbar />

        {/* Área de contenido dinámico (aquí va el ProductsPage, etc.) */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;