import { ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { api } from '../../../../src/lib/api'
import { VisualizationMemory } from '../../../../src/components/VisualizationMemory'

type MemoryProps = {
  coverUrl: string
  content: string
  id: string
  memoryDate: string
  isPublic: boolean
}

export default function MemoriesPublic() {
  const { bottom, top } = useSafeAreaInsets()
  const params = useSearchParams()

  const [memory, setMemory] = useState<MemoryProps>()

  async function loadMemories() {
    const response = await api.get(`/memories/public/${params.id}`)
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
      {memory && <VisualizationMemory memory={memory} />}
    </ScrollView>
  )
}
