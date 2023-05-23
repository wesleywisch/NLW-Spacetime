import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import dayjs from 'dayjs'

import ptBr from 'dayjs/locale/pt-br'
dayjs.locale(ptBr)

type MemoryProps = {
  memory: {
    coverUrl: string
    excerpt: string
    id: string
    createdAt: string
  }
}

export function Memory({ memory }: MemoryProps) {
  return (
    <div className="space-y-4">
      <time className="-ml-8 flex items-center gap-2 text-xs text-gray-100 before:h-px before:w-5 before:bg-gray-50 sm:text-sm">
        {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
      </time>

      <Image
        src={memory.coverUrl}
        alt=""
        width={592}
        height={580}
        className="aspect-video w-full rounded-lg object-cover"
      />

      <p className="text-base leading-relaxed text-gray-100 sm:text-lg">
        {memory.excerpt}
      </p>

      <Link
        href={`/memories/${memory.id}`}
        className="flex items-center gap-2 text-xs text-gray-200 hover:text-gray-100 sm:text-sm"
      >
        Ler mais
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
