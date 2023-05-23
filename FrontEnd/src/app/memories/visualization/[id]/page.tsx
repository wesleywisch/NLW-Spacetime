import { cookies } from 'next/headers'

import { MemoryVisualization } from '../../../../components/MemoryVisualization'

import { api } from '../../../../lib/api'

type MemoryProps = {
  coverUrl: string
  content: string
  id: string
  createdAt: string
  isPublic: boolean
}

async function getApi(params: { id: string }, token?: string) {
  const response = await api.get(`/memories/${params.id}`, {
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export default async function MemoryId({ params }: { params: { id: string } }) {
  const token = cookies().get('token')?.value

  const memory: MemoryProps = await getApi(params, token)

  return (
    <div className="relative flex flex-col gap-10 p-8">
      <div className="visible absolute bottom-0 left-1 top-0 w-2 bg-stripes lg:invisible" />

      <MemoryVisualization memory={memory} />
    </div>
  )
}
