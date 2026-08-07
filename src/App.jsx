import MainLayout from './components/layout/MainLayout';
import ProductsPage from './pages/ProductsPage';

function App() {
  return (
    <MainLayout>
      {/* 
        Todo lo que pongamos aquí adentro será recibido como "children" 
        por el MainLayout y renderizado en la zona central gris.
      */}
      <ProductsPage />
    </MainLayout>
  );
}

export default App;