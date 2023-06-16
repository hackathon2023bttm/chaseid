import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import OperationProfile from '../../../lib/models/OperationProfile'

export async function GET(request: NextRequest,
  { params } : { params: { id : string }}) {

  await dbConnect()

  try {
    const profile = await OperationProfile.findById(params.id)
    if (!profile) {
      return NextResponse.json({ error: 'not_found' }, { status: 404})
    }
    return NextResponse.json(profile)
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
