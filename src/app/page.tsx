export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center">
          Wolthers & Associates Travel Management
        </h1>
      </div>
      
      <div className="mt-8 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">Authentication</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Multi-method authentication with SSO, OTP, and trip codes
          </p>
        </div>

        <div className="group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">Trip Planning</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Real-time collaborative trip planning with AI assistance
          </p>
        </div>

        <div className="group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">File Management</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Secure file storage with CDN delivery
          </p>
        </div>

        <div className="group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">Multi-tenant</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Scalable architecture for multiple organizations
          </p>
        </div>
      </div>
    </main>
  )
}