import { SignUp } from '@stackframe/stack'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-purple-500 rounded-2xl mx-auto mb-4"></div>
          <h1 className="text-3xl font-bold mb-2">Join DankPass</h1>
          <p className="text-gray-400">Create your account to start earning points</p>
        </div>
        
        <div className="flex justify-center">
          <SignUp />
        </div>
      </div>
    </div>
  )
}
