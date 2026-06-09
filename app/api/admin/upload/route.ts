import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

export async function POST(req: NextRequest) {
  const { getServerSession } = require('next-auth');
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const ext = file.name.split('.').pop()
  const key = `${crypto.randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME!)
    .upload(key, buffer, {
      contentType: file.type,
      upsert: true
    })

  if (error) {
    console.error('Supabase upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data: publicUrlData } = supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME!)
    .getPublicUrl(key)

  const url = publicUrlData.publicUrl
  return NextResponse.json({ url })
}
