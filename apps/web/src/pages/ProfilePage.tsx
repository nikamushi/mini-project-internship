import { UserIcon } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import './ProfilePage.css'

export function ProfilePage() {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return null
  }

  const isAdmin = currentUser.role === 'ADMIN'

  return (
    <div className="lc-profile">
      <h1 className="lc-profile__title">Profil</h1>

      <div className="lc-profile__card">
        <div className="lc-profile__identity">
          <Avatar name={currentUser.name} size="lg" />
          <div className="lc-profile__identity-text">
            <p className="lc-profile__name">{currentUser.name}</p>
            <p className="lc-profile__email">{currentUser.email}</p>
          </div>
        </div>

        <dl className="lc-profile__list">
          <div className="lc-profile__item">
            <dt>Nama</dt>
            <dd>{currentUser.name}</dd>
          </div>
          <div className="lc-profile__item">
            <dt>Email</dt>
            <dd>{currentUser.email}</dd>
          </div>
          <div className="lc-profile__item">
            <dt>Peran</dt>
            <dd>
              <Badge tone={isAdmin ? 'primary' : 'neutral'}>
                {isAdmin ? 'Administrator' : 'Pengguna'}
              </Badge>
            </dd>
          </div>
          <div className="lc-profile__item">
            <dt>Status Akun</dt>
            <dd>
              <Badge tone={currentUser.isActive === false ? 'danger' : 'success'}>
                {currentUser.isActive === false ? 'Nonaktif' : 'Aktif'}
              </Badge>
            </dd>
          </div>
        </dl>
      </div>

      <p className="lc-profile__note">
        <UserIcon size={14} aria-hidden="true" />
        Informasi akun dikelola oleh administrator kampus.
      </p>
    </div>
  )
}
