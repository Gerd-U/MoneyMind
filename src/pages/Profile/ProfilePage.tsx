export default function ProfilePage() {
  const user = {
    nombre: 'Gerald',
    apellido: 'Mora',
    correo: 'gerald@moneymind.com',
    fechaRegistro: '2026-01-15',
    estadoUsuario: true,
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-bold">Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account information</p>
      </div>

      {/* Profile card */}
      <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-8 flex flex-col gap-8 max-w-2xl">

        {/* Avatar + name */}
        <div className="flex items-center gap-5">
          <div
            style={{ backgroundColor: '#3ecf8e20', color: '#3ecf8e' }}
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
          >
            {user.nombre[0]}{user.apellido[0]}
          </div>
          <div>
            <p className="text-white text-lg font-semibold">{user.nombre} {user.apellido}</p>
            <p className="text-slate-400 text-sm">{user.correo}</p>
          </div>
          <span
            style={{ backgroundColor: '#3ecf8e20', color: '#3ecf8e' }}
            className="ml-auto text-xs font-medium px-2 py-1 rounded-md"
          >
            Active
          </span>
        </div>

        {/* Divider */}
        <div style={{ borderColor: '#1e3a5f' }} className="border-t" />

        {/* Fields */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs">First name</span>
            <span className="text-white text-sm font-medium">{user.nombre}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs">Last name</span>
            <span className="text-white text-sm font-medium">{user.apellido}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs">Email</span>
            <span className="text-white text-sm font-medium">{user.correo}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 text-xs">Member since</span>
            <span className="text-white text-sm font-medium">{user.fechaRegistro}</span>
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
            Edit profile
          </button>
          <button
            style={{ borderColor: '#1e3a5f' }}
            className="px-4 py-2 rounded-lg text-sm font-medium border text-slate-400 hover:text-white transition-colors"
          >
            Change password
          </button>
        </div>

      </div>
    </div>
  )
}