import { cookies } from 'next/headers'

import { EmptyMemories } from '../components/EmptyMemories'
import { Memory } from '../components/Memory'

import { api } from '../lib/api'

type MemoryProps = {
  coverUrl: string
  excerpt: string
  id: string
  createdAt: string
}

export default async function Home() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return <EmptyMemories />
  }

  const token = cookies().get('token')?.value
  const response = await api.get('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memories: MemoryProps[] = response.data

  if (memories.length === 0) {
    return <EmptyMemories />
  }

  return (
    <div className="relative flex flex-col gap-10 p-8">
      <div className="visible absolute bottom-0 left-1 top-0 w-2 bg-stripes lg:invisible" />

      {memories.map((memory) => (
        <Memory key={memory.id} memory={memory} />
      ))}
    </div>
  )
}
