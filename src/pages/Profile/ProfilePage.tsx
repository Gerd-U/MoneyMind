import { useEffect, useState } from 'react'
import { getUserByEmail } from '../../services/UserService'
import { useUserStore } from '../../store/UserStore'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

export default function ProfilePage() {
  const { user, setUser } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) return

    const fetchUser = async () => {
      setLoading(true)
      setError(null)
      try {
        //Traer datos del servidor
        const data = await getUserByEmail('anaGonzalez@moneymind.com')
        //Guardar en el store
        setUser(data)
      } catch (err) {
        //Mostrar error si algo falla
        setError('No se pudo cargar la información del perfil. Intentá de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  //Mostrar spinner mientras carga
  if (loading) return <LoadingSpinner />

  //Mostrar error si algo falló
  if (error) return <ErrorMessage message={error} onRetry={() => {}} />

  // Si aún no hay datos
  if (!user) return null

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-bold">Perfil</h1>
        <p className="text-slate-400 text-sm mt-1">Administrá la información de tu cuenta</p>
      </div>

      {/* Profile card */}
      <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-8 flex flex-col gap-8 max-w-2xl">

        {/* Avatar + name */}
        <div className="flex items-center gap-5">
          <div
            style={{ backgroundColor: '#3ecf8e20', color: '#3ecf8e' }}
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
          >
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <p className="text-white text-lg font-semibold">{user.firstName} {user.lastName}</p>
            <p className="text-slate-400 text-sm">{user.email}</p>
          </div>
          <span
            style={{ backgroundColor: '#3ecf8e20', color: '#3ecf8e' }}
            className="ml-auto text-xs font-medium px-2 py-1 rounded-md"
          >
            {user.active ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        {/* Divider */}
        <div style={{ borderColor: '#1e3a5f' }} className="border-t" />

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs">Nombre</span>
            <span className="text-white text-sm font-medium">{user.firstName}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs">Apellido</span>
            <span className="text-white text-sm font-medium">{user.lastName}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs">Correo</span>
            <span className="text-white text-sm font-medium">{user.email}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs">Miembro desde</span>
            <span className="text-white text-sm font-medium">{user.registrationDate}</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderColor: '#1e3a5f' }} className="border-t" />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            style={{ backgroundColor: '#3ecf8e' }}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
          >
            Editar perfil
          </button>
          <button
            style={{ borderColor: '#1e3a5f' }}
            className="px-4 py-2 rounded-lg text-sm font-medium border text-slate-400 hover:text-white transition-colors"
          >
            Cambiar contraseña
          </button>
        </div>

      </div>
    </div>
  )
}