import { NextRequest, NextResponse } from 'next/server'

import { api } from '../../../../lib/api'

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  const redirectTo = req.cookies.get('redirectTo')?.value

  const registerResponse = await api.post('/register', {
    code,
  })

  const { token } = registerResponse.data

  const redirectURL = redirectTo ?? new URL('/', req.url)

  const cookieExpiresInSeconds = 60 * 60 * 24 * 10 // 10 days

  return NextResponse.redirect(redirectURL, {
    headers: {
      'Set-Cookie': `token=${token}; Path=/; max-age=${cookieExpiresInSeconds}`,
    },
  })
}
