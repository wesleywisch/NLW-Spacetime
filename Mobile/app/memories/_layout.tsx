import { ImageBackground, TouchableOpacity, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Link, Redirect, Stack, useRouter } from 'expo-router'
import { styled } from 'nativewind'
import Icon from '@expo/vector-icons/Feather'
import * as SecureStore from 'expo-secure-store'

import blurBg from '../../src/assets/bg-blur.png'
import Stripes from '../../src/assets/stripes.svg'
import NLWLogo from '../../src/assets/nlw-spacetime-logo.svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'

const StyledStripes = styled(Stripes)

export default function Layout() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<
    null | boolean
  >(null)

  const router = useRouter()
  const { bottom, top } = useSafeAreaInsets()

  async function signOut() {
    await SecureStore.deleteItemAsync('token')
    router.push('/')
  }

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      setIsUserAuthenticated(!!token)
    })
  }, [])

  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 bg-gray-900"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StyledStripes className="absolute left-2" />
      <StatusBar style="light" translucent />

      <View
        className="mt-4 flex-row items-center justify-between px-8"
        style={{ paddingBottom: bottom, paddingTop: top }}
      >
        <NLWLogo />

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>

          <Link href="/memories/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="new" />
        {!isUserAuthenticated && <Redirect href="/" />}
      </Stack>
    </ImageBackground>
  )
}
