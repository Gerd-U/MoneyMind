import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/Dashboard/DashboardPage'
import PaymentMethodsPage from './pages/PaymentMethods/PaymentMethodsPage'
import ProfilePage from './pages/Profile/ProfilePage'
import ReportsPage from './pages/Reports/ReportsPage'
import NotFoundPage from './pages/NotFound/NotFoundPage'
import MovementsPage from './pages/Movements/MovementsPage'
import CategoriesPage from './pages/Categories/CategoriesPage'
import BudgetPage from './pages/Budget/BudgetPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="movimientos" element={<MovementsPage />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="categorias" element={<CategoriesPage />} />
          <Route path="metodos-pago" element={<PaymentMethodsPage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="/budgets" element={<BudgetPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

// y en las rutas:

export default App