export default function Docs() {
  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>
      <div className="m-6 mb-12">
        <h1 className="text-3xl font-bold">
          ChaseID API Documentation
        </h1>

        <div className="mt-4">
          <p className="my-2">
            Details the ChaseID API which enables product onboarding with an easy API integration in the style of <a href="https://shopify.dev/docs/api/admin-rest/2022-04/resources/checkout" target="_blank" className="text-blue-700 underline">Shopify Checkout</a>.
          </p>
          <p className="my-2">
            The primary API resource is <span className="text-emerald-700">VerificationSession</span>,
            which is a request for one or more sections of a merchant's profile. When creating one,
            a list of policies can be requested. The result will contain a URL where the user can be redirected
            to to complete the policies. Once the user completes the session, ChaseID will redirect the user
            back to the original website via the specified <code className="text-purple-700">flow_redirect_url</code>.
            A successful session will have the <code className="text-purple-700">completed</code> status.
          </p>
          <p className="my-2">
            A <span className="text-emerald-700">Policy</span> represents a section of the merchant's profile,
            which defines an expected product capability, the data elements collected from the merchant to
            fulfill the policy's requirements, and the opaque review processes that are run as a part of the policy.
            A policy that succeeds processing will have the <code className="text-purple-700">completed</code> status.
            If it succeeded immediately, this new status will reflect when you call back to check the status.
            Otherwise, delayed policy completion (e.g. if a manual review is required) will be in the <code className="text-purple-700">pending</code> status,
            and you will need to check back later with the same verification session ID to check completion.
          </p>
          <p className="my-2">
            The policy types available today are: <code className="text-purple-700">operation_profile</code>, <code className="text-purple-700">credit_profile</code>.
          </p>
          <div className="my-4">
            <h2 className="text-xl font-bold" id="integration-checklist">Integration Checklist  <a href="#integration-checklist" className="opacity-40 hover:opacity-100">🔗</a></h2>
            <ol className="pl-1">
              <li><input type="checkbox" /> A backend endpoint that begins the flow, which calls the ChaseID API to create a session. The user should be redirected to the returned <code className="text-purple-700">verification_session_url</code>.</li>
              <li><input type="checkbox" /> An endpoint to handle the redirection from ChaseID after the user completes their verification session. The ID of the verification session will be passed as a query parameter (like: <code className="text-purple-700">?session_id={"<"}verification_session_id{">"}</code>). This endpoint should be set in the field <code className="text-purple-700">flow_redirect_url</code> when creating the verification session.</li>
            </ol>
          </div>
          <div className="my-4">
            <h2 className="text-xl font-bold" id="api-flow">API Flow  <a href="#api-flow" className="opacity-40 hover:opacity-100">🔗</a></h2>
            <ol className="pl-6 list-decimal">
              <li>Create a verification session.</li>
              <li>Redirect the user to the URL returned in the field <code className="text-purple-700">verification_session_url</code>.</li>
              <li>Upon completing the session, the user will be redirected from ChaseID to <code className="text-purple-700">flow_redirect_url</code>.</li>
              <li>Using the <code className="text-purple-700">session_id</code> set as a query parameter, query the API again to get the status of the requested profiles.</li>
            </ol>
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl mb-2" id="api-reference">API Reference <a href="#api-reference" className="opacity-40 hover:opacity-100">🔗</a></h1>
          <h2 className="text-xl font-bold" id="api-reference--create-verification-session">
            Create a Verification Session <a href="#api-reference--create-verification-session" className="opacity-40 hover:opacity-100">🔗</a>
          </h2>
          <div>
            This creates a verification session.
            Verification sessions have a redirect URL that the user should be redirected to.
            When the user completes the verification session at Chase ID, they will

          </div>
          <h3 className="text-lg">Request Example</h3>
          <pre className="text-sm overflow-auto bg-slate-200 p-2">
            <code>POST /api/verification_sessions</code>
          <div>
          <code>
            {JSON.stringify({
              "flow_redirect_url": "https://topcookie.net/callback/flow",
              "policies": [
                {
                  "requested": true,
                  "type": "credit_profile"
                }
              ],
              "custom_data": "user-123"
            }, null, 2)}
          </code>
          </div>
          </pre>
          <h3 className="text-lg">Response Example</h3>
          <pre className="text-sm overflow-auto bg-slate-200 p-2">
            <code>200 OK</code>
            <div>
              <code>
              {JSON.stringify({
                "_id": "648b7063f3c903e303d6d9c6",
                "verification_session_url": "https://chaseid.com/verify/648b7063f3c903e303d6d9c6",
                "flow_redirect_url": "https://topcookie.net/callback/flow",
                "policies": [
                  {
                    "requested": true,
                    "type": "credit_profile",
                    "status": "requested",
                    "_id": "648b7063f3c903e303d6d9c7"
                  }
                ],
                "custom_data": "user-123",
                "created_at": "2023-06-15T20:11:15.323Z",
                "updated_at": "2023-06-15T20:11:15.323Z"
            }, null, 2)}
              </code>
            </div>
          </pre>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold" id="api-reference--get-verification-session">
            Get a Verification Session <a href="#api-reference--get-verification-session" className="opacity-40 hover:opacity-100">🔗</a>
          </h2>
          <div>
            Looks up a verification session by its ID. It will contain the status of the requested profiles.
          </div>
          <h3 className="text-lg">Request Example</h3>
          <pre className="text-sm overflow-auto bg-slate-200 p-2">
            <code>GET /api/verification_sessions/{"<"}verification_session_id{">"}</code>
          <div>
          </div>
          </pre>
          <h3 className="text-lg">Response Example</h3>
          <pre className="text-sm overflow-auto bg-slate-200 p-2">
            <code>200 OK</code>
            <div>
              <code>
              {JSON.stringify({
                "_id": "648b7063f3c903e303d6d9c6",
                "verification_session_url": "https://chaseid.com/verify/648b7063f3c903e303d6d9c6",
                "flow_redirect_url": "https://topcookie.net/callback/flow",
                "policies": [
                  {
                    "requested": true,
                    "type": "credit_profile",
                    "status": "completed",
                    "_id": "648b7063f3c903e303d6d9c7"
                  }
                ],
                "custom_data": "user-123",
                "created_at": "2023-06-15T20:11:15.323Z",
                "updated_at": "2023-06-15T20:11:15.323Z"
            }, null, 2)}
              </code>
            </div>
          </pre>
        </div>


      </div>
    </>
  )
}
