"use server";

import { s3Client } from "@/utils/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const { text } = await request.json();
    const input = {
      Body: text,
      Bucket: process.env.S3_BUCKET,
      Key: "1234",
      ContentType: "text/plain",
    };

    const command = new PutObjectCommand(input);

    const response = await s3Client.send(command);

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
