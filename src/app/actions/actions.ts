"use server"

import { getObject } from "@/utils/s3"
import { createClient } from "@/utils/supabase/server"

export async function getData(code: string) {
  try {
    if (code == null) throw Error("Code is missing")

    const supabase = await createClient()

    const { data } = await supabase
      .from("shares")
      .select("*")
      .eq("otp_code", String(code))
      .maybeSingle()

    if (data && data.object_key) {
      const response = await getObject(process.env.S3_BUCKET ?? "", data.object_key)
      return response
    }

    throw Error("Missing object key")
  } catch (error) {
    throw error
  }
}
