import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages/login/page';
import RegisterPage from '@/pages/register/page';
import HomePage from '@/pages/main/page';
import StoresPage from '@/pages/stores/page';
import MenusPage from '@/pages/stores/[storeId]/menus/page';
import CartPage from '@/pages/cart/page';
import OrdersPage from '@/pages/orders/page';
import MyStoresPage from '@/pages/stores/my/page';
import StoreApplyPage from '@/pages/stores/my/apply/page';
import StoreOrdersPage from '@/pages/stores/my/[storeId]/orders/page';
import StoreEditPage from '@/pages/stores/my/[storeId]/edit/page';
import { ProtectedRoute } from '@/components/protected-route';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/stores" element={<ProtectedRoute><StoresPage /></ProtectedRoute>} />
        <Route path="/stores/my" element={<ProtectedRoute><MyStoresPage /></ProtectedRoute>} />
        <Route path="/stores/my/apply" element={<ProtectedRoute><StoreApplyPage /></ProtectedRoute>} />
        <Route path="/stores/my/:storeId/edit" element={<ProtectedRoute><StoreEditPage /></ProtectedRoute>} />
        <Route path="/stores/my/:storeId/orders" element={<ProtectedRoute><StoreOrdersPage /></ProtectedRoute>} />
        <Route path="/stores/:storeId/menus" element={<ProtectedRoute><MenusPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;