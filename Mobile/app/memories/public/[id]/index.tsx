import { View, TouchableOpacity, ScrollView, Text, Image } from 'react-native'
import { useState, useEffect } from 'react'
import { Link, useRouter, useSearchParams } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

import NLWLogo from '../../../../src/assets/nlw-spacetime-logo.svg'

import { api } from '../../../../src/lib/api'

dayjs.locale(ptBr)

type MemoryProps = {
  coverUrl: string
  excerpt: string
  id: string
  memoryDate: string
}

export default function MemoriesPublic() {
  const { bottom, top } = useSafeAreaInsets()
  const params = useSearchParams()

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <Text>{params.id}</Text>
    </ScrollView>
  )
}
