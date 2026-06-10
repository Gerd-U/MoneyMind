import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/Dashboard/DashboardPage'
import MovementsPage from './pages/Movements/MovementsPage'
import ReportsPage from './pages/Reports/ReportsPage'
import CategoriesPage from './pages/Categories/CategoriesPage'
import PaymentMethodsPage from './pages/PaymentMethods/PaymentMethodsPage'
import ProfilePage from './pages/Profile/ProfilePage'
import BudgetPage from './pages/Budget/BudgetPage'
import NotFoundPage from './pages/NotFound/NotFoundPage'

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
          <Route path="budgets" element={<BudgetPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App