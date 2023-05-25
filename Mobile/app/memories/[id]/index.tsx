import { ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'

import { VisualizationMemory } from '../../../src/components/VisualizationMemory'

import { api } from '../../../src/lib/api'

type MemoryProps = {
  coverUrl: string
  content: string
  id: string
  isPublic: boolean
  memoryDate: string
}

export default function Memories() {
  const { bottom, top } = useSafeAreaInsets()
  const params = useSearchParams()

  const [memory, setMemory] = useState<MemoryProps>()

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token')

    const response = await api.get(`/memories/${params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setMemory(response.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      {memory && <VisualizationMemory memory={memory} edit />}
    </ScrollView>
  )
}
