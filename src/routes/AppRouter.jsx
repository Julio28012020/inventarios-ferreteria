import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import { ProductForm } from '../components/products/ProductForm';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inventario/productos" element={<ProductsPage />} />
          <Route 
            path="/inventario/nuevo" 
            element={
              <div className="max-w-3xl mx-auto">
                <ProductForm onSuccess={() => window.location.href = '/inventario/productos'} onCancel={() => window.history.back()} />
              </div>
            } 
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};