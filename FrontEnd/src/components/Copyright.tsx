import Link from 'next/link'

export function Copyright() {
  return (
    <div>
      <p className="pt-2 text-sm leading-relaxed text-gray-200 lg:pt-0">
        Feito com ❤ no NLW da{' '}
        <Link
          target="_blank"
          rel="noreferrer"
          href="https://rocketseat.com.br"
          className="underline hover:text-gray-100"
        >
          Rocketseat
        </Link>
      </p>
    </div>
  )
}
