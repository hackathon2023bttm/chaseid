import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongodb'
import User from '../../../lib/models/User'

export async function GET(request: NextRequest,
  { params } : { params: { id : string }}) {

  await dbConnect()

  try {
    const user = await User.findById(params.id)
    if (!user) {
      return NextResponse.json({ error: 'not_found' }, { status: 404})
    }
    return NextResponse.json(user)
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
