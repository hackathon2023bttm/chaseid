import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import OperationProfileForm from '../../../components/OperationProfileForm';
import CreditProfileForm from '../../../components/CreditProfileForm';
import { redirect } from 'next/navigation'
import { RedirectType } from 'next/dist/client/components/redirect';

export default function Session() {
  const [ loading, setLoading ] = useState(true);
  const [ verificationSession, setVerificationSession ] = useState(null);

  const router = useRouter()

  useEffect(() => {
    console.log('useeffect', router.query.session_id)
    if (!router.query.session_id) {
      return
    }
    fetch("/api/verification_sessions/" + router.query.session_id)
      .then((resp) => resp.json())
      .then((vs) => {
        console.log('gotvs', vs)
        setVerificationSession(vs)
        setLoading(false);
      })
      .catch(console.error)
  }, [router])

  const onClick = async (event) => {
    event.preventDefault()
    console.log('submitted')
    const resp = await fetch("/api/verification_sessions/" + verificationSession._id + "/submit2", {
      method: "POST",
      body: JSON.stringify({
        profiles: ['credit_profile'],
        credit_profile: { 'employer': 'foobar'}
      })
    })
    console.log('verified', await resp.json())
    const redirectUrl = verificationSession.flow_redirect_url + "?verification_session_id=" + verificationSession._id
    // redirect(redirectUrl, RedirectType.push)
    console.log('redirecting', redirectUrl)
    window.location.href = redirectUrl
  }

  return (
    <div>
      <script src="https://cdn.tailwindcss.com"></script>
      <h1>{ router.query.session_id }</h1>
      <form>
        <input type="email" placeholder="Email" />
      </form>

      {
        !loading && verificationSession.profiles && verificationSession.profiles.some(p => p.type === 'operation_profile') && (
          <OperationProfileForm />
        )
      }
      {
        !loading && verificationSession.profiles && verificationSession.profiles.some(p => p.type === 'credit_profile') && (
          <CreditProfileForm />
        )
      }
      <button onClick={onClick}>Submit</button>
    </div>
  )
}
