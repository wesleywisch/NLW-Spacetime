import { View, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'

import { api } from '../../src/lib/api'
import { Memory } from '../../src/components/Memory'

type MemoryProps = {
  coverUrl: string
  excerpt: string
  id: string
  memoryDate: string
}

export default function Memories() {
  const [memories, setMemories] = useState<MemoryProps[]>([])

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token')

    const response = await api.get('/memories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setMemories(response.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView className="flex-1">
      <View className="mt-6 space-y-10">
        {memories.map((memory) => (
          <Memory key={memory.id} memory={memory} />
        ))}
      </View>
    </ScrollView>
  )
}
