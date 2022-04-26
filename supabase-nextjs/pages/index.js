import { Auth, Typography, Button } from '@supabase/ui'
import { supabase } from '../utils/supabaseClient'
import { useState, useEffect } from 'react'
import Account from '../components/Account'

export default function AuthBasic() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
     
        {!session ? <Auth supabaseClient={supabase} providers={['google']} className="auth"/> : <Account key={session.user.id} session={session}/>}
      
    </Auth.UserContextProvider>
  )
}