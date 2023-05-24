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
    memoryDate: string
    createdBy?: {
      name: string
      avatarUrl: string
      githubLink: string
    }
  }
}

export function Memory({ memory }: MemoryProps) {
  return (
    <div className="space-y-4">
      {!memory.createdBy ? (
        <time className="-ml-8 flex items-center gap-2 text-xs text-gray-100 before:h-px before:w-5 before:bg-gray-50 sm:text-sm">
          {dayjs(memory.memoryDate).format('D[ de ]MMMM[, ]YYYY')}
        </time>
      ) : (
        <div className="-ml-8 flex items-center gap-2 text-xs text-gray-100 before:h-px before:w-5 before:bg-gray-50 sm:text-sm">
          <Link
            href={`https://github.com/${memory.createdBy.githubLink}`}
            className="text- flex items-center gap-3 py-3"
          >
            <Image
              src={memory.createdBy.avatarUrl}
              alt={memory.createdBy.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />

            <p className="max-w-[8.75rem] text-sm leading-snug">
              {memory.createdBy.name}{' '}
              <time className="text-xs text-gray-100 before:bg-gray-50 sm:text-sm">
                {dayjs(memory.memoryDate).format('D[ de ]MMMM[, ]YYYY')}
              </time>
            </p>
          </Link>
        </div>
      )}

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
        href={
          memory.createdBy
            ? `/memories/public/${memory.id}`
            : `/memories/visualization/${memory.id}`
        }
        className="flex items-center gap-2 text-xs text-gray-200 hover:text-gray-100 sm:text-sm"
      >
        Ler mais
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
