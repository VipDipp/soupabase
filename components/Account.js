import { useState, useEffect } from 'react'
import Avatar from './Avatar'
import { supabase } from '../utils/supabaseClient'

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [first_name, setFirst_name] = useState(null)
  const [doc_url, setDoc_url] = useState(null)
  const [avatar_url, setAvatar_url] = useState(null)
  const [phone, setPhone] = useState(null)
  const [last_name, setLast_name] = useState(null)
  const [country, setCountry] = useState(null)
  const [city, setCity] = useState(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('KYC')
        .select(`phone, first_name, last_name, country, city, doc_url, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setPhone(data.phone)
        setFirst_name(data.first_name)
        setLast_name(data.last_name)
        setCountry(data.country)
        setCity(data.city)
        setDoc_url(data.doc_url)
        setAvatar_url(data.avatar_url)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ phone, first_name, last_name, country, city, doc_url, avatar_url }) {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        phone,
        first_name,
        last_name,
        country,
        city,
        doc_url,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('KYC').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
      <Avatar
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatar_url(url)
          updateProfile({ first_name, doc_url, avatar_url: url })
        }}
      />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="text"
          value={phone || ''}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="first_name">First Name</label>
        <input
          id="first_name"
          type="text"
          value={first_name || ''}
          onChange={(e) => setFirst_name(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="last_name">Last Name</label>
        <input
          id="last_name"
          type="text"
          value={last_name || ''}
          onChange={(e) => setLast_name(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="country">Country</label>
        <input
          id="country"
          type="text"
          value={country || ''}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          value={city || ''}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="doc_url">doc_url</label>
        <input
          id="doc_url"
          type="text"
          value={doc_url || ''}
          onChange={(e) => setDoc_url(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button block primary"
          onClick={() => updateProfile({ phone, first_name, last_name, country, city, doc_url, avatar_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button className="button block" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  )
}