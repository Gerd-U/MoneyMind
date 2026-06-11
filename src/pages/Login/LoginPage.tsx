import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [authError, setAuthError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validate = (): boolean => {
    const newErrors = { email: '', password: '' }

    if (!form.email.trim()) {
      newErrors.email = 'El correo es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Correo inválido'
    }

    if (!form.password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (form.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres'
    }

    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    if (!validate()) return
    setIsLoading(true)
    const success = await login(form.email, form.password)
    setIsLoading(false)
    if (success) {
      navigate('/')
    } else {
      setAuthError('Correo o contraseña incorrectos')
    }
  }

  const inputStyle = (hasError: boolean) => ({
    backgroundColor: '#0D1520',
    border: `1px solid ${hasError ? '#f07060' : '#1e3a5f'}`,
    color: 'white',
  })

  return (
    <div
      style={{ backgroundColor: '#090F1A' }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div
        style={{ backgroundColor: '#101D32', border: '1px solid #1e3a5f' }}
        className="w-full max-w-md rounded-2xl p-8 flex flex-col gap-6 shadow-2xl"
      >
        {/* Logo */}
        <div className="text-center">
          <span style={{ color: '#3ecf8e' }} className="text-3xl font-bold tracking-tight">
            Money<span className="text-white">Mind</span>
          </span>
          <p className="text-slate-400 text-sm mt-2">Iniciá sesión en tu cuenta</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Correo electrónico</label>
            <input
              type="text"
              value={form.email}
              onChange={e => {
                setForm({ ...form, email: e.target.value })
                setErrors({ ...errors, email: '' })
              }}
              placeholder="tu@correo.com"
              style={inputStyle(!!errors.email)}
              className="rounded-lg px-3 py-2.5 text-sm outline-none placeholder-slate-600"
            />
            {errors.email && (
              <span style={{ color: '#f07060' }} className="text-xs">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={e => {
                setForm({ ...form, password: e.target.value })
                setErrors({ ...errors, password: '' })
              }}
              placeholder="••••••••"
              style={inputStyle(!!errors.password)}
              className="rounded-lg px-3 py-2.5 text-sm outline-none placeholder-slate-600"
            />
            {errors.password && (
              <span style={{ color: '#f07060' }} className="text-xs">{errors.password}</span>
            )}
          </div>

          {/* Auth error */}
          {authError && (
            <div
              style={{ backgroundColor: '#f0706020', border: '1px solid #f07060' }}
              className="rounded-lg px-4 py-3 text-center"
            >
              <span style={{ color: '#f07060' }} className="text-sm">{authError}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{ backgroundColor: isLoading ? '#2a8a60' : '#3ecf8e' }}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-slate-400 text-sm">
          ¿No tenés cuenta?{' '}
          <Link
            to="/register"
            style={{ color: '#3ecf8e' }}
            className="font-medium hover:opacity-80 transition-opacity"
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  )
}