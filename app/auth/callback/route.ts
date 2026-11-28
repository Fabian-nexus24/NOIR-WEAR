import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/shop'

  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/shop"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const phone = typeof user.user_metadata?.phone === "string" ? user.user_metadata.phone : ""
        const firstName = typeof user.user_metadata?.first_name === "string" ? user.user_metadata.first_name : ""
        const lastName = typeof user.user_metadata?.last_name === "string" ? user.user_metadata.last_name : ""
        await supabase.from("profiles").upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          phone,
        })
      }
      return NextResponse.redirect(`${origin}${safeNext}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirmation`)
}
