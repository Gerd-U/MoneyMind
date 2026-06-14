import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { config } from '../../config'
import Modal from '../../components/common/Modal'

export default function ProfilePage() {
  const { user, login } = useAuth()

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    currentPassword: '',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordError, setPasswordError] = useState('')

  const handleSaveProfile = async () => {
    if (!user) return
    if (!profileForm.currentPassword) {
      setSaveError('Ingresá tu contraseña actual para guardar los cambios.')
      return
    }
    setIsSaving(true)
    setSaveError('')
    setSaveSuccess('')
    try {
      const response = await fetch(`${config.api.url}/users/${user.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          email: profileForm.email,
          password: profileForm.currentPassword,
          active: user.active,
        }),
      })
      if (!response.ok) throw new Error()
      await login(profileForm.email, profileForm.currentPassword)
      setSaveSuccess('Perfil actualizado correctamente.')
      setIsEditingProfile(false)
      setProfileForm(prev => ({ ...prev, currentPassword: '' }))
    } catch {
      setSaveError('No se pudo actualizar el perfil.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!user) return
    setPasswordError('')
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('La contraseña nueva debe tener al menos 6 caracteres.')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.')
      return
    }
    setIsSaving(true)
    try {
      const response = await fetch(`${config.api.url}/users/${user.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: passwordForm.newPassword,
          active: user.active,
        }),
      })
      if (!response.ok) throw new Error()
      setSaveSuccess('Contraseña actualizada correctamente.')
      setIsChangingPassword(false)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      setPasswordError('No se pudo actualizar la contraseña.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) return null

  const inputStyle = {
    backgroundColor: '#0D1520',
    border: '1px solid #1e3a5f',
    color: 'white',
  }

  return (
    <div className="flex flex-col gap-8">

      <div>
        <h1 className="text-white text-2xl font-bold">Perfil</h1>
        <p className="text-slate-400 text-sm mt-1">Administrá la información de tu cuenta</p>
      </div>

      <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-8 flex flex-col gap-8 max-w-2xl">

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

        <div style={{ borderColor: '#1e3a5f' }} className="border-t" />

        {saveSuccess && (
          <div
            style={{ backgroundColor: '#3ecf8e20', border: '1px solid #3ecf8e' }}
            className="rounded-lg px-4 py-3"
          >
            <span style={{ color: '#3ecf8e' }} className="text-sm">{saveSuccess}</span>
          </div>
        )}

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
            <span className="text-white text-sm font-medium">
              {new Date(user.registrationDate).toLocaleDateString('es-CR')}
            </span>
          </div>
        </div>

        <div style={{ borderColor: '#1e3a5f' }} className="border-t" />

        <div className="flex gap-3">
          <button
            onClick={() => { setIsEditingProfile(true); setSaveSuccess('') }}
            style={{ backgroundColor: '#3ecf8e' }}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
          >
            Editar perfil
          </button>
          <button
            onClick={() => { setIsChangingPassword(true); setSaveSuccess('') }}
            style={{ borderColor: '#1e3a5f' }}
            className="px-4 py-2 rounded-lg text-sm font-medium border text-slate-400 hover:text-white transition-colors"
          >
            Cambiar contraseña
          </button>
        </div>

      </div>

      <Modal
        isOpen={isEditingProfile}
        onClose={() => { setIsEditingProfile(false); setSaveError(''); setProfileForm(prev => ({ ...prev, currentPassword: '' })) }}
        title="Editar perfil"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Nombre</label>
            <input
              type="text"
              value={profileForm.firstName}
              onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
              style={inputStyle}
              className="rounded-lg px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Apellido</label>
            <input
              type="text"
              value={profileForm.lastName}
              onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
              style={inputStyle}
              className="rounded-lg px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Correo</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
              style={inputStyle}
              className="rounded-lg px-3 py-2.5 text-sm outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Contraseña actual</label>
            <input
              type="password"
              value={profileForm.currentPassword}
              onChange={e => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
              placeholder="••••••••"
              style={inputStyle}
              className="rounded-lg px-3 py-2.5 text-sm outline-none placeholder-slate-600"
            />
          </div>
          {saveError && <span style={{ color: '#f07060' }} className="text-xs">{saveError}</span>}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              style={{ backgroundColor: '#3ecf8e' }}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
            >
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button
              onClick={() => { setIsEditingProfile(false); setSaveError(''); setProfileForm(prev => ({ ...prev, currentPassword: '' })) }}
              style={{ borderColor: '#1e3a5f' }}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isChangingPassword} onClose={() => setIsChangingPassword(false)} title="Cambiar contraseña">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Contraseña nueva</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="••••••••"
              style={inputStyle}
              className="rounded-lg px-3 py-2.5 text-sm outline-none placeholder-slate-600"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 text-xs">Confirmar contraseña</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder="••••••••"
              style={inputStyle}
              className="rounded-lg px-3 py-2.5 text-sm outline-none placeholder-slate-600"
            />
          </div>
          {passwordError && <span style={{ color: '#f07060' }} className="text-xs">{passwordError}</span>}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleChangePassword}
              disabled={isSaving}
              style={{ backgroundColor: '#3ecf8e' }}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-black hover:opacity-90 transition-opacity"
            >
              {isSaving ? 'Guardando...' : 'Actualizar contraseña'}
            </button>
            <button
              onClick={() => setIsChangingPassword(false)}
              style={{ borderColor: '#1e3a5f' }}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

    </div>
  )
}