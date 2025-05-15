import { createClient } from '@supabase/supabase-js'
import { Database } from '../../../database.types'

export async function createSupabaseClient() {
  return createClient<Database>(process.env.SUPABASE_URL ?? '', process.env.SUPABASE_ANON_KEY ?? '')
}
