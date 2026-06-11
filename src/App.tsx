import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/Dashboard/DashboardPage'
import MovementsPage from './pages/Movements/MovementsPage'
import ReportsPage from './pages/Reports/ReportsPage'
import CategoriesPage from './pages/Categories/CategoriesPage'
import PaymentMethodsPage from './pages/PaymentMethods/PaymentMethodsPage'
import ProfilePage from './pages/Profile/ProfilePage'
import BudgetPage from './pages/Budget/BudgetPage'
import LoginPage from './pages/Login/LoginPage'
import RegisterPage from './pages/Register/RegisterPage'
import NotFoundPage from './pages/NotFound/NotFoundPage'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Rutas públicas */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />

          {/* Rutas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="movimientos" element={<MovementsPage />} />
            <Route path="reportes" element={<ReportsPage />} />
            <Route path="categorias" element={<CategoriesPage />} />
            <Route path="metodos-pago" element={<PaymentMethodsPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="presupuestos" element={<BudgetPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App