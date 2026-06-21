import { supabase } from './supabase'

export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }
  return data
}

export async function getMembers() {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching members:', error)
    return []
  }
  return data
}

export async function getAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*, author:members(name)') // Fetch author name
    .order('publish_date', { ascending: false })

  if (error) {
    console.error('Error fetching announcements:', error)
    return []
  }
  return data
}

export async function getAchievements() {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching achievements:', error)
    return []
  }
  return data
}

// Utility to easily get the full image URL from a path
export function getPublicImageUrl(bucket: 'posters' | 'profiles', path: string | null) {
  if (!path) return null
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
