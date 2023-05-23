import { User } from 'lucide-react'
import Link from 'next/link'

export function SignIn() {
  return (
    <div className="flex w-full flex-col sm:flex-row sm:justify-between">
      <Link
        href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
        className="flex items-center gap-3 py-3 text-left transition-colors hover:text-gray-50 lg:py-0"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400">
          <User className="h-5 w-5 text-gray-500" />
        </div>

        <p className="max-w-[8.75rem] text-sm leading-snug">
          <span className="underline">Crie sua conta</span> e salve suas
          memórias
        </p>
      </Link>

      <Link
        href="/memories/public"
        className="flex items-center gap-3 py-3 text-left transition-colors hover:text-gray-50 lg:py-0"
      >
        Visualizar memorias públicas
      </Link>
    </div>
  )
}
