import { generatePutPresignedUrl } from "@/utils/s3"

export default async function Countries() {
  // const supabase = await createClient()
  // const { data: countries } = await supabase.from('countries').select()

  // return <pre>{JSON.stringify(countries, null, 2)}</pre>

  const url = generatePutPresignedUrl(process.env.S3_BUCKET ?? '', 'abc/xyz/123/456')
  return <h1>{url}</h1>
}
