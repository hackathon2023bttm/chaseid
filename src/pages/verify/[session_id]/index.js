import { useRouter } from 'next/router'

export default function Session() {
  const router = useRouter()
  return (
    <div>
      <script src="https://cdn.tailwindcss.com"></script>
      <h1>{ router.query.session_id }</h1>
      <form>
        <input type="email" />
      </form>
    </div>
  )
}
