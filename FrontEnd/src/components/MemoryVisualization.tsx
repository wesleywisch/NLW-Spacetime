import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import dayjs from 'dayjs'

import ptBr from 'dayjs/locale/pt-br'
import { NewMemoryForm } from './NewMemoryForm'
dayjs.locale(ptBr)

type Memory = {
  coverUrl: string
  content: string
  id: string
  memoryDate: string
  isPublic: boolean
  createdBy?: {
    name: string
    avatarUrl: string
    githubLink: string
  }
}

type MemoryProps = {
  memory: Memory
  edit?: boolean
}

export function MemoryVisualization({ memory, edit }: MemoryProps) {
  return (
    <div className="space-y-4">
      <Link
        href={!memory.createdBy ? '/' : '/memories/public'}
        className="mb-10 flex items-center gap-1 text-lg text-gray-200 hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" /> Voltar à timeline
      </Link>

      {!edit && (
        <>
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

                <p className="flex flex-col text-sm leading-snug">
                  {memory.createdBy.name}{' '}
                  <time className="text-xs text-gray-100 before:bg-gray-50 sm:text-sm">
                    {dayjs(memory.memoryDate).format('D[ de ]MMMM[, ]YYYY')}
                  </time>
                </p>
              </Link>
            </div>
          )}
        </>
      )}

      {!memory.createdBy ? (
        <NewMemoryForm memory={memory} />
      ) : (
        <div className="flex flex-1 flex-col gap-2">
          <Image
            width={400}
            height={400}
            src={memory.coverUrl}
            alt="Preview"
            className="aspect-video w-full rounded-lg object-cover"
          />

          <p className="max-h-52 w-full resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0">
            {memory?.content}
          </p>
        </div>
      )}
    </div>
  )
}
