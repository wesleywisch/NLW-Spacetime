import { View, ScrollView, Text } from 'react-native'
import { useState, useEffect } from 'react'

import { api } from '../../../src/lib/api'
import { Memory } from '../../../src/components/Memory'

type MemoryProps = {
  coverUrl: string
  excerpt: string
  id: string
  memoryDate: string
  createdBy: {
    avatarUrl: string
    githubLink: string
    name: string
  }
}

export default function MemoriesPublic() {
  const [memories, setMemories] = useState<MemoryProps[]>([])

  async function loadMemories() {
    const response = await api.get('/memories/public')

    setMemories(response.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View className="mt-6 space-y-10">
        <View className="mb-5 flex items-center">
          <Text className="text-lg text-gray-200">Memórias públicas</Text>
        </View>

        {memories.map((memory) => (
          <Memory key={memory.id} memory={memory} />
        ))}
      </View>
    </ScrollView>
  )
}
