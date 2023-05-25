import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Switch,
  Platform,
} from 'react-native'
import Icon from '@expo/vector-icons/Feather'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import * as ImagePicker from 'expo-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

import { api } from '../lib/api'
import { useState } from 'react'

dayjs.locale(ptBr)

type MemoryProps = {
  memory: {
    coverUrl: string
    content: string
    id: string
    memoryDate: string
    isPublic: boolean
  }
  edit?: boolean
}

export function VisualizationMemory({ memory, edit }: MemoryProps) {
  const router = useRouter()
  const [content, setContent] = useState(memory.content)
  const [isPublic, setIsPublic] = useState(memory.isPublic)
  const [memoryDate, setMemoryDate] = useState(new Date(memory.memoryDate))
  const [newImage, setNewImage] = useState('')
  const [memoryDateOpen, setMemoryDateOpen] = useState(false)

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      if (result.assets[0]) {
        setNewImage(result.assets[0].uri)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function handleUpdateMemory() {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if (newImage) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        uri: newImage,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any)

      const uploadResponse = await api.post('upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      coverUrl = uploadResponse.data.fileUrl
    }

    await api.put(
      `/memories/${memory.id}`,
      {
        coverUrl: coverUrl || memory.coverUrl,
        content,
        isPublic,
        memoryDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
  }

  async function handleDelete(id: string) {
    if (id) {
      const token = await SecureStore.getItemAsync('token')

      const response = await api.delete(`/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 200) {
        router.push('/')
      }
    }
  }

  return (
    <View className="space-y-10">
      <View className="space-y-4" key={memory.id}>
        {edit && (
          <View className="flex-row items-center gap-2 px-6">
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: '#767577', true: '#372560' }}
              thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
            />

            <Text className="font-body text-base text-gray-200">
              Tornar memória pública
            </Text>
          </View>
        )}

        {edit ? (
          <View className="px-8">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setMemoryDateOpen(true)}
              className="flex flex-row items-center justify-center rounded-lg border border-gray-100 p-2"
            >
              <Icon name="calendar" size={16} color="#9e9ea0" />
              <Text className="text-md ml-2 text-gray-100">
                Data da memória -{' '}
                <Text className="text-gray-200">
                  {dayjs(memoryDate).format('DD/MM/YYYY')}
                </Text>
              </Text>
            </TouchableOpacity>

            {memoryDateOpen && (
              <DateTimePicker
                value={memoryDate}
                mode={'date'}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, value) => {
                  setMemoryDate(value)
                  setMemoryDateOpen(false)
                }}
                locale="pt-BR"
                maximumDate={new Date()}
                minimumDate={new Date('1899-01-01')}
              />
            )}
          </View>
        ) : (
          <View className="flex-row items-center gap-2">
            <View className="h-px w-5 bg-gray-50" />
            <Text className="font-body text-xs text-gray-100">
              {dayjs(memory.memoryDate).format('D[ de ]MMMM[, ]YYYY')}
            </Text>
          </View>
        )}

        <View className="space-y-4 px-8">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openImagePicker}
            className="h-48 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
          >
            {newImage ? (
              <Image
                source={{ uri: newImage }}
                alt="Preview"
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <Image
                source={{
                  uri: memory.coverUrl,
                }}
                alt=""
                className="aspect-video w-full rounded-lg"
              />
            )}
          </TouchableOpacity>

          <TextInput
            multiline
            defaultValue={content}
            onChangeText={setContent}
            textAlignVertical="top"
            className="p-0 font-body text-lg text-gray-50"
          />
        </View>
      </View>

      {edit && (
        <View className="w-full flex-row justify-between px-6">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleUpdateMemory}
            className="rounded-2xl bg-green-500 p-3 font-alt text-xs uppercase leading-none text-black hover:bg-green-600"
          >
            <Text>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleDelete(memory.id)}
            className="rounded-2xl bg-red-500 p-3 font-alt text-xs uppercase leading-none text-black hover:bg-red-600"
          >
            <Text>Deletar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
