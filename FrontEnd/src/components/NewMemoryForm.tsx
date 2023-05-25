'use client'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, CalendarDays, InfoIcon, CheckIcon } from 'lucide-react'
import Cookie from 'js-cookie'

import { MediaPicker } from './MediaPicker'
import { api } from '../lib/api'
import dayjs from 'dayjs'

type NewMemoryFormProps = {
  memory?: {
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
}

type Info = {
  msg: string
  type: 'error' | 'success' | 'null'
}

export function NewMemoryForm({ memory }: NewMemoryFormProps) {
  const router = useRouter()

  const [info, setInfo] = useState<Info>({ type: 'null', msg: '' })

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const token = Cookie.get('token')

      const formData = new FormData(event.currentTarget)

      const fileToUpload = formData.get('coverUrl')
      const verify = formData.get('coverUrl') as { name: string }

      let coverUrl = ''

      if (verify.name && fileToUpload) {
        const uploadFormData = new FormData()
        uploadFormData.set('file', fileToUpload)

        const uploadResponse = await api.post('/upload', uploadFormData)

        coverUrl = uploadResponse.data.fileUrl
      }

      if (!memory) {
        await api.post(
          '/memories',
          {
            coverUrl,
            content: formData.get('content'),
            isPublic: formData.get('isPublic'),
            memoryDate: new Date(
              formData.get('memoryDate') as string,
            ).toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        return router.push('/')
      }

      await api.put(
        `/memories/${memory.id}`,
        {
          coverUrl: coverUrl || memory.coverUrl,
          content: formData.get('content'),
          isPublic: formData.get('isPublic'),
          memoryDate: new Date(
            formData.get('memoryDate') as string,
          ).toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setInfo({
        type: 'success',
        msg: 'Memória atualizada com sucesso!',
      })
    } catch (err) {
      setInfo({
        type: 'error',
        msg: 'Não foi possível atualizar! Tente novamente.',
      })
    }
  }

  async function handleDelete(id: string) {
    if (id) {
      try {
        const token = Cookie.get('token')

        const response = await api.delete(`/memories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 200) {
          router.push('/')
        }
      } catch (err) {
        setInfo({
          type: 'error',
          msg: 'Não foi possível deletar! Tente novamente.',
        })
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setInfo({ type: 'null', msg: '' })
    }, 5000)

    return () => clearTimeout(timer)
  }, [info])

  return (
    <form
      onSubmit={handleCreateMemory}
      className="relative flex flex-1 flex-col gap-2"
    >
      {info && info.type === 'error' && (
        <div className="absolute right-3 top-8 flex animate-info items-center gap-2 rounded-lg bg-gray-800 p-2 md:top-4 lg:top-11">
          <InfoIcon className="h-3 w-3 text-red-800 md:h-5 md:w-5" />
          <span className="md:text-md text-xs text-red-700">{info.msg}</span>
        </div>
      )}

      {info && info.type === 'success' && (
        <div className="absolute right-3 top-8 flex animate-info items-center gap-2 rounded-lg bg-gray-800 p-2 md:top-4 lg:top-11">
          <CheckIcon className="h-3 w-3 text-green-800 md:h-5 md:w-5" />
          <span className="md:text-md text-xs text-green-700">{info.msg}</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-200 hover:text-gray-100 sm:text-sm"
        >
          <Camera className="h-4 w-4" />
          Anexar mídia
        </label>

        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-xs text-gray-200 hover:text-gray-100 sm:text-sm"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            value="true"
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
          />
          Tornar memória pública
        </label>
      </div>

      <div className="mt-4 flex flex-col py-2">
        <label
          htmlFor="memoryDate"
          className="flex cursor-pointer items-center gap-2 rounded-lg text-xs text-gray-200 hover:text-gray-100 sm:text-sm"
        >
          <CalendarDays />
          Data da memória
        </label>

        <input
          type="date"
          id="memoryDate"
          name="memoryDate"
          className="mt-4 flex cursor-pointer items-center self-start rounded-lg border border-gray-200 bg-transparent p-2 text-xs text-gray-200 hover:text-gray-100 sm:text-sm"
          min="1899-01-01"
          defaultValue={
            memory?.memoryDate && dayjs(memory.memoryDate).format('YYYY-MM-DD')
          }
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      <MediaPicker memory={memory} />

      <textarea
        name="content"
        defaultValue={memory?.content}
        spellCheck={false}
        className="max-h-52 w-full resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
      />

      <div className="flex justify-between">
        <button
          type="submit"
          className="mt-5 rounded-full bg-green-500 px-3 py-2 font-alt text-xs uppercase leading-none text-black hover:bg-green-600 md:px-5 md:py-3 md:text-sm"
        >
          Salvar
        </button>

        {memory && (
          <button
            type="button"
            onClick={() => handleDelete(memory.id)}
            className="mt-5 rounded-full bg-red-500 px-3 py-2 font-alt text-xs uppercase leading-none text-black hover:bg-red-600 md:px-5 md:py-3 md:text-sm"
          >
            Deletar
          </button>
        )}
      </div>
    </form>
  )
}
