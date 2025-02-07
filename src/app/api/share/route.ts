"use server";

import { generate_otp } from "@/utils/core";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { objectKey } = await request.json();

    const supabase = await createClient();
    const { error, data } = await supabase
      .from("shares")
      .insert({
        otp_code: generate_otp(),
        active: true,
        object_key: objectKey,
      })
      .select();

    console.log(data);

    if (error) throw error;
    return NextResponse.json({ data: data });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
