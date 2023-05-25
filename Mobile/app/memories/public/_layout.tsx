import { ImageBackground } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'
import { styled } from 'nativewind'

import blurBg from '../../../src/assets/bg-blur.png'
import Stripes from '../../../src/assets/stripes.svg'

const StyledStripes = styled(Stripes)

export default function Layout() {
  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 bg-gray-900"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StyledStripes className="absolute left-2" />
      <StatusBar style="light" translucent />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="[id]/index" />
      </Stack>
    </ImageBackground>
  )
}
