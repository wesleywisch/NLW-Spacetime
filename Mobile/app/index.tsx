import { useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'

import { api } from '../src/lib/api'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/9e6d5a82cdaae2fb8470',
}

export default function App() {
  const router = useRouter()

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '9e6d5a82cdaae2fb8470',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery,
  )

  async function handleGithubOAuthCode(code: string) {
    // const response = await api.post('/register', {
    //   code,
    // })

    // const { token } = response.data

    await SecureStore.setItemAsync(
      'token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiV2VzbGV5IFdpc2NoIExvcmVuemV0aSIsImF2YXRhclVybCI6Imh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS83OTE1OTQ4Nz92PTQiLCJzdWIiOiJjOWUwYTdiNS0yNGNjLTRlZWQtYWQwNi1jMWNjYWI4OTU4M2EiLCJpYXQiOjE2ODQ4NjM3MTYsImV4cCI6MTY4NTcyNzcxNn0.MpQcKrbpAP--O5XotF3drPZk-LN7z25PhilgvofJ8xs',
    )
    router.push('/memories')
  }

  // useEffect(() => {
  //   // console.log(
  //   //   makeRedirectUri({
  //   //     scheme: 'nlwspacetime',
  //   //   }),
  //   // )

  //   if (response?.type === 'success') {
  //     const { code } = response.params

  //     handleGithubOAuthCode(code)
  //   }
  // }, [response])

  return (
    <View className="flex-1 items-center px-10 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text className="leading-tig text-center font-title text-2xl text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => handleGithubOAuthCode('1')}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>

        <Link href="/memories/public" asChild>
          <TouchableOpacity className="items-center justify-center pt-5">
            <Text className="text-md text-gray-100">
              Visualizar memórias públicas
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
