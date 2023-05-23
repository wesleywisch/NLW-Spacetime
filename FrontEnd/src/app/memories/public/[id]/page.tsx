import { MemoryVisualization } from '../../../../components/MemoryVisualization'

import { api } from '../../../../lib/api'

type MemoryProps = {
  coverUrl: string
  content: string
  id: string
  createdAt: string
  isPublic: boolean
  createdBy: {
    name: string
    avatarUrl: string
    githubLink: string
  }
}

async function getApi(params: { id: string }) {
  const response = await api.get(`/memories/public/${params.id}`)

  return response.data
}

export default async function PageMemoryPublic({
  params,
}: {
  params: { id: string }
}) {
  const memory: MemoryProps = await getApi(params)

  return (
    <div className="relative flex flex-col gap-10 p-8">
      <div className="visible absolute bottom-0 left-1 top-0 w-2 bg-stripes lg:invisible" />

      <MemoryVisualization memory={memory} />
    </div>
  )
}
