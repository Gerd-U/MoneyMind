import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/Dashboard/DashboardPage'
import MovimientosPage from './pages/Movements/MovementsPage'
import CategoriesPage from './pages/Categories/CategoriesPage'
import PaymentMethodsPage from './pages/PaymentMethods/PaymentMethodsPage'
import ProfilePage from './pages/Profile/ProfilePage'
import ReportsPage from './pages/Reports/ReportsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="movimientos" element={<MovimientosPage />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="categorias" element={<CategoriesPage />} />
          <Route path="metodos-pago" element={<PaymentMethodsPage />} />
          <Route path="perfil" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App