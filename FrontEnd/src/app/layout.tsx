import {
  Roboto_Flex as Roboro,
  Bai_Jamjuree as BaiJamjuree,
} from 'next/font/google'
import { ReactNode } from 'react'
import { cookies } from 'next/headers'

import { Hero } from '../components/Hero'
import { Profile } from '../components/Profile'
import { SignIn } from '../components/SignIn'
import { Copyright } from '../components/Copyright'

import './globals.css'

const roboto = Roboro({ subsets: ['latin'], variable: '--font-roboto' })
const baiJamjuree = BaiJamjuree({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bai-jamjuree',
})

export const metadata = {
  title: 'NLW Spacetime',
  description:
    'Uma cápsula do tempo construída com React, Next.js, TailwindCSS e Typescript.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = cookies().has('token')

  return (
    <html lang="pt-BR">
      <body
        className={`${roboto.variable} ${baiJamjuree.variable} bg-gray-900 font-sans text-gray-100`}
      >
        <main className="sm:flex sm:flex-col lg:grid lg:min-h-screen lg:grid-cols-2">
          <div className="relative flex flex-col items-start justify-between overflow-hidden border-r border-white/10 bg-[url(../assets/bg-stars.svg)] bg-cover px-8 py-3 sm:px-10 sm:py-3 lg:px-28 lg:py-16">
            {/* blur */}
            <div className="absolute right-0 top-1/2 h-[18rem] w-[32.875rem] -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-700 opacity-50 blur-full" />

            {/* stripes */}
            <div className="invisible absolute bottom-0 right-2 top-0 w-2 bg-stripes lg:visible" />

            {isAuthenticated ? <Profile /> : <SignIn />}
            <Hero />
            <Copyright />
          </div>

          <div className="flex max-h-screen flex-col bg-[url(../assets/bg-stars.svg)] bg-cover lg:overflow-y-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
