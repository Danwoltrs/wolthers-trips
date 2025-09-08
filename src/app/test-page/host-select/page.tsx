import HostCompanySelect from '@/components/trips/HostCompanySelect'

export default function HostSelectTest() {
  // Using a placeholder trip ID for demo purposes
  const tripId = '00000000-0000-0000-0000-000000000000'
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Host Company Selection Demo</h1>
      <HostCompanySelect tripId={tripId} />
    </div>
  )
}

