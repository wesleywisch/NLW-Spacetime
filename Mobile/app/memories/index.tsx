import { View, TouchableOpacity, ScrollView, Text, Image } from 'react-native'
import { useState, useEffect } from 'react'
import { Link } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import * as SecureStore from 'expo-secure-store'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

import { api } from '../../src/lib/api'

dayjs.locale(ptBr)

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
          <View className="space-y-4" key={memory.id}>
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50" />
              <Text className="font-body text-xs text-gray-100">
                {dayjs(memory.memoryDate).format('D[ de ]MMMM[, ]YYYY')}
              </Text>
            </View>

            <View className="space-y-4 px-8">
              <Image
                source={{
                  uri: memory.coverUrl,
                }}
                alt=""
                className="aspect-video w-full rounded-lg"
              />

              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>

              <Link href={`/memories/${memory.id}`} asChild>
                <TouchableOpacity className="flex-row items-center gap-2">
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9e9ea0" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
