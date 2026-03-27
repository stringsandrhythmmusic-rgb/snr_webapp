import { getInitials } from '@/lib/utils'
import { BASE_URL } from '@/api/client'

interface AvatarProps {
  name: string
  url?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-20 h-20 text-xl',
}

export default function Avatar({ name, url, size = 'md' }: AvatarProps) {
  const avatarUrl = url ? (url.startsWith('http') ? url : `${BASE_URL}${url}`) : null

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover border border-border`}
      />
    )
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-burgundy flex items-center justify-center font-semibold text-ivory border border-border`}
    >
      {getInitials(name)}
    </div>
  )
}
