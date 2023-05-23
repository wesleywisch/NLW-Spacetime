import Image from 'next/image'
import Link from 'next/link'

import NlwLogo from '../assets/nlw-spacetime-logo.svg'

export function Hero() {
  return (
    <div className="space-y-5 py-3">
      <Image src={NlwLogo} alt="NLW Spacetime" className="h-13" />

      <div className="max-w-[26.25rem] space-y-1">
        <h1 className="text-3xl font-bold leading-tight text-gray-50 md:text-5xl">
          Sua cápsula do tempo
        </h1>

        <p className="text-sm leading-relaxed md:text-lg">
          Colecione momentos marcantes da sua jornada e compartilhe (se quiser)
          com o mundo!
        </p>
      </div>

      <Link
        href="/memories/new"
        className="inline-block rounded-full bg-green-500 px-3 py-2 font-alt text-xs uppercase leading-none text-black hover:bg-green-600 md:px-5 md:py-3 md:text-sm"
      >
        Cadastrar lembrança
      </Link>
    </div>
  )
}
