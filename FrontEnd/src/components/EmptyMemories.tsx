import Link from 'next/link'

export function EmptyMemories() {
  return (
    <div className="flex flex-1 items-center justify-center p-16">
      <p className="w-[22.5rem] text-center leading-relaxed">
        Você ainda não registrou nenhuma lembrança, comece a{' '}
        <Link href="/" className="underline hover:text-gray-50">
          Criar agora
        </Link>
      </p>
    </div>
  )
}
