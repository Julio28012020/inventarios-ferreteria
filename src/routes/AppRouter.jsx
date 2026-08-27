import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import SalesPage from '../pages/SalesPage';
import { ProductForm } from '../components/products/ProductForm';
import EditProductPage from '../pages/EditProductPage';
import { SuppliersPage } from '../pages/SuppliersPage';
import { NewSupplierPage } from '../pages/NewSupplierPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/inventario/productos" element={<ProductsPage />} />
          <Route path="/inventario/editar/:id" element={<EditProductPage />} />
          <Route path="/ventas" element={<SalesPage />} />
          <Route path='/proveedores' element={<SuppliersPage />} />
          <Route path="/proveedores/nuevo" element={<NewSupplierPage />} />
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