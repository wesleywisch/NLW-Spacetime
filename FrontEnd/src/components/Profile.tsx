import Link from 'next/link'
import Image from 'next/image'

import { getUser } from '../lib/auth'

export function Profile() {
  const { name, avatarUrl } = getUser()

  return (
    <div className="flex items-center gap-3 text-left">
      <Image
        src={avatarUrl}
        alt={name}
        width={40}
        height={40}
        className="h-10 w-10 rounded-full"
      />

      <p className="max-w-[8.75rem] text-sm leading-snug">
        {name}{' '}
        <Link href="/" className="block text-red-400 hover:text-red-300">
          Quero sair
        </Link>
      </p>
    </div>
  )
}
