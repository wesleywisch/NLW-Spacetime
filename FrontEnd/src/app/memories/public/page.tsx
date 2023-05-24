import { EmptyMemories } from '../../../components/EmptyMemories'
import { Memory } from '../../../components/Memory'

import { api } from '../../../lib/api'

type PageMemoriesPublicProps = {
  coverUrl: string
  excerpt: string
  id: string
  memoryDate: string
}

export default async function PageMemoriesPublic() {
  const response = await api.get('/memories/public')

  const memories: PageMemoriesPublicProps[] = response.data

  if (memories.length === 0) {
    return <EmptyMemories pagePublic />
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
