import { View, TouchableOpacity, Text, Image } from 'react-native'
import { Link } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import dayjs from 'dayjs'
import * as WebBrowser from 'expo-web-browser'
import ptBr from 'dayjs/locale/pt-br'

dayjs.locale(ptBr)

type MemoryType = {
  coverUrl: string
  excerpt: string
  id: string
  memoryDate: string
  createdBy?: {
    avatarUrl: string
    githubLink: string
    name: string
  }
}

type MemoryProps = {
  memory: MemoryType
}

export function Memory({ memory }: MemoryProps) {
  async function handleOpenGithubBrowser() {
    await WebBrowser.openBrowserAsync(
      `https://github.com/${memory.createdBy.githubLink}`,
    )
  }

  return (
    <View className="mt-6 space-y-4" key={memory.id}>
      {!memory.createdBy ? (
        <View className="flex-row items-center gap-2">
          <View className="h-px w-5 bg-gray-50" />
          <Text className="font-body text-xs text-gray-100">
            {dayjs(memory.memoryDate).format('D[ de ]MMMM[, ]YYYY')}
          </Text>
        </View>
      ) : (
        <View className="flex flex-row items-center gap-2 text-xs text-gray-100">
          <View className="h-px w-5 bg-gray-50" />
          <TouchableOpacity
            className="flex-row items-center pl-2"
            onPress={handleOpenGithubBrowser}
          >
            <Image
              source={{ uri: memory.createdBy.avatarUrl }}
              alt={memory.createdBy.name}
              className="h-10 w-10 rounded-full"
            />

            <View className="pl-3">
              <Text className="text-md text-gray-200">
                {memory.createdBy.name}{' '}
              </Text>
              <Text className="mt-1 text-xs text-gray-100">
                {dayjs(memory.memoryDate).format('D[ de ]MMMM[, ]YYYY')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

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
            <Text className="font-body text-sm text-gray-200">Ler mais</Text>
            <Icon name="arrow-right" size={16} color="#9e9ea0" />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  )
}
