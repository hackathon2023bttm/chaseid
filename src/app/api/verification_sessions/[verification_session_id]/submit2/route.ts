import dbConnect from '@/app/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import VerificationSession from '@/app/lib/models/VerificationSession'
import CreditProfile from '@/app/lib/models/CreditProfile';
import OperationProfile from '@/app/lib/models/OperationProfile'
import User from '@/app/lib/models/User';
import { pick, omit } from 'lodash';
const OPERATION_PROFILE = 'operation_profile'

// import { pick } from 'lodash';

// const port = process.env.PORT || 3000
// const base = process.env.NODE_ENV === 'development' ? ('http://localhost:' + port) : 'https://chaseid.fly.dev'

export async function POST(request: NextRequest, { params }: { params: { verification_session_id: string } }) {

  await dbConnect()

  try {
    const verificationSession = await VerificationSession.findById(params.verification_session_id);
    if (!verificationSession) {
      return NextResponse.json({ error: 'session_not_found'}, {status: 404})
    }

    const json = await request.json();
    console.log('got submit2', JSON.stringify(json))
    const userId = json['user_id']

    let user = null;
    if (userId) {
      user = await User.findById(userId);
      console.log('got user', user.toObject())
    }


    // credit profile
    if (json['credit_profile']) {
      console.log('credit profile', json['credit_profile'])
      const creditProfile = await CreditProfile.create(pick(json['credit_profile'], [
        'employer',
        'annual_income_amount',
        'annual_income_currency',
      ]))
      if (user) {
        user.primaryCreditProfile = creditProfile._id
        user.creditProfiles.push(creditProfile._id)
        await user.save();
        console.log('saved credit profile', user.primaryEmail, user.toObject(), creditProfile._id, creditProfile.toObject())
      }
    }

    // // operation profile
    // const profile_type = pick(json, 'profile_types')
    // const profile_type_array = Object.values(profile_type);
    // const profile_exist = profile_type_array.some(arr => arr.includes(OPERATION_PROFILE));
    // if (profile_exist){
    //   const operation_profile = Object.values(pick(json, 'operation_profile'))

    //   // creating the profile in db
    //   const opsProfile = await OperationProfile.create(pick(operation_profile, ['dba_name', 'description', 'naics'])) as any
    //   console.log('created opsProfile', opsProfile.toObject())
    //   if (user) {
    //     // for (let prof of opsProfiles) {
    //       user.primaryOperationProfile = opsProfile._id
    //       user.operationProfiles.push(opsProfile._id)
    //       await user.save();
    //       console.log('saved operation profile', user.primaryEmail, user.toObject(), opsProfile._id, opsProfile.toObject())
    //     // }
    //   }
    // }



    if (json['operation_profile']) {
      console.log('credit operation_profile', json['operation_profile'])
      const operationProfile = await OperationProfile.create(pick(json['operation_profile'], [
        'dba_name',
        'description',
        'naics',
      ]))
      if (user) {
        user.primaryOperationProfile = operationProfile._id
        user.operationProfiles.push(operationProfile._id)
        await user.save();
        console.log('saved operation profile', user.primaryEmail, user.toObject(), operationProfile._id, operationProfile.toObject())
      }
    }

    // Complete everything
    verificationSession.profiles.forEach(async (p: any) => {
      p.status = "complete"
      await p.save()
    })
    await verificationSession.save()
    console.log('saved', JSON.stringify(verificationSession.toObject()))

    return NextResponse.json({ status: 'success' })
  } catch (e) {
    console.error('Failed to save verification session', e);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}
