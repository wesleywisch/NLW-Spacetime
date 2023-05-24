import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  TextInput,
  ScrollView,
  Image,
  Platform,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import * as ImagePicker from 'expo-image-picker'
import Icon from '@expo/vector-icons/Feather'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

import { api } from '../../src/lib/api'

dayjs.locale(ptBr)

export default function NewMemory() {
  const router = useRouter()

  const [preview, setPreview] = useState<null | string>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [content, setContent] = useState('')
  const [memoryDate, setMemoryDate] = useState(new Date())
  const [memoryDateOpen, setMemoryDateOpen] = useState(false)

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      if (result.assets[0]) {
        setPreview(result.assets[0].uri)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if (preview) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        uri: preview,
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

    await api.post(
      '/memories',
      {
        content,
        isPublic,
        coverUrl,
        memoryDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    router.push('/memories')
  }

  return (
    <ScrollView className="flex-1 px-8">
      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
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

        <View>
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

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openImagePicker}
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
        >
          {preview ? (
            <Image
              source={{ uri: preview }}
              alt="Preview"
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#fff" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
          className="p-0 font-body text-lg text-gray-50"
          placeholderTextColor="#56565a"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCreateMemory}
          className="items-center self-end rounded-full bg-green-500 px-5 py-2"
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
