"use server"

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
      const res = await fetch(
        "http://localhost:3000/api/s3?" +
          new URLSearchParams({
            objectKey: data.object_key,
          }).toString()
      )

      const resJson = await res.json()

      console.log(resJson)

      return resJson
    }

    throw Error("Missing object key")
  } catch (error) {
    throw error
  }
}
