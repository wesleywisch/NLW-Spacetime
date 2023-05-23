import Link from 'next/link'

export function EmptyMemories({ pagePublic }: { pagePublic: boolean }) {
  return (
    <div className="flex flex-1 items-center justify-center p-16">
      {!pagePublic ? (
        <p className="w-[22.5rem] text-center leading-relaxed">
          Você ainda não registrou nenhuma lembrança, comece a{' '}
          <Link href="/" className="underline hover:text-gray-50">
            Criar agora
          </Link>
        </p>
      ) : (
        <p className="w-[22.5rem] text-center leading-relaxed">
          Nenhum usuário ainda deixou uma memória publica seja você o primeiro{' '}
          <Link href="/" className="underline hover:text-gray-50">
            Criar agora
          </Link>
        </p>
      )}
    </div>
  )
}
