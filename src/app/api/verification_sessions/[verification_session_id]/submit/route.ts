import dbConnect from '@/app/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import OperationProfile from '@/app/lib/models/OperationProfile';
import VerificationSession from '@/app/lib/models/VerificationSession'
import { pick } from 'lodash';

const port = process.env.PORT || 3000
const base = process.env.NODE_ENV === 'development' ? ('http://localhost:' + port) : 'https://chaseid.fly.dev'
const OPERATION_PROFILE = 'operation_profile'
const INDETITY_PROFILE = 'identity_profile'

export async function POST(request: NextRequest,  {params}: {params: { verification_session_id: string }}) {
  await dbConnect()
  try {
    const json = await request.json();
    const profile_type = pick(json, 'profile_types')
    const profile_type_array = Object.values(profile_type);
    const profile_exist = profile_type_array.some(arr => arr.includes(OPERATION_PROFILE));
    if (profile_exist){
      const operation_profile = Object.values(pick(json, 'operation_profile'))

      // creating the profil in db
      const opsProfile = await OperationProfile.create(operation_profile)
      
      // mark VerificationSession as operation_profile status": "complete"
      const update = {
        profiles:{
          requested: true,
          type: OPERATION_PROFILE,
          status: 'complete'
        }}
      
      const doc = await VerificationSession.findByIdAndUpdate(params.verification_session_id, update, { new: true }) 
      
      // return NextResponse.json({ message: 'success' }, { status: 200 })
      const response = Object.assign({}, {
        message: 'success',
      }, opsProfile);
  
      return NextResponse.json(response)

    } else {
      console.log("wrong profile type")
    }
  } catch (e) {
    console.error('Failed to create verification session', e);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }

}
