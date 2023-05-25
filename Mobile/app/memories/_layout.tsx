import { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ImageBackground, TouchableOpacity, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Link, Stack, useRouter, usePathname, useNavigation } from 'expo-router'
import { styled } from 'nativewind'
import Icon from '@expo/vector-icons/Feather'
import * as SecureStore from 'expo-secure-store'

import blurBg from '../../src/assets/bg-blur.png'
import Stripes from '../../src/assets/stripes.svg'
import NLWLogo from '../../src/assets/nlw-spacetime-logo.svg'

const StyledStripes = styled(Stripes)

export default function Layout() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<
    null | boolean
  >(null)

  const router = useRouter()
  const navigation = useNavigation()
  const pathname = usePathname()

  const { bottom, top } = useSafeAreaInsets()

  async function signOut() {
    await SecureStore.deleteItemAsync('token')
    router.push('/')
  }

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      setIsUserAuthenticated(!!token)
      if (!token) {
        router.push('/')
      }
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
          {isUserAuthenticated && (
            <TouchableOpacity
              onPress={signOut}
              className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
            >
              <Icon name="log-out" size={16} color="#000" />
            </TouchableOpacity>
          )}

          {pathname === '/memories' ? (
            <Link href="/memories/new" asChild>
              <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
                <Icon name="plus" size={16} color="#000" />
              </TouchableOpacity>
            </Link>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="h-10 w-10 items-center justify-center rounded-full bg-purple-600"
            >
              <Icon name="arrow-left" size={16} color="#000" />
            </TouchableOpacity>
          )}
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
      </Stack>
    </ImageBackground>
  )
}
