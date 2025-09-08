'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { addCompanyRepresentative } from '@/app/actions/add-company-representative'

interface Company {
  id: string
  name: string
}

interface Props {
  tripId: string
}

export default function HostCompanySelect({ tripId }: Props) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [rep, setRep] = useState({ name: '', email: '', phone: '' })
  const router = useRouter()

  useEffect(() => {
    supabase
      .from('companies')
      .select('id,name')
      .order('name')
      .then(({ data }) => {
        if (data) setCompanies(data)
      })
  }, [])

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyId = e.target.value
    setSelectedCompany(companyId)
    if (companyId && window.confirm('Add a representative now?')) {
      setShowForm(true)
    } else {
      setShowForm(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCompany) return
    await addCompanyRepresentative({
      companyId: selectedCompany,
      tripId,
      name: rep.name,
      email: rep.email,
      phone: rep.phone
    })
    setShowForm(false)
    setRep({ name: '', email: '', phone: '' })
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Host Company</label>
        <select
          value={selectedCompany}
          onChange={handleSelect}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">Select company...</option>
          {companies.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-2 border p-4 rounded">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={rep.name}
              onChange={e => setRep({ ...rep, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="border rounded px-2 py-1 w-full"
              value={rep.email}
              onChange={e => setRep({ ...rep, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone (optional)</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={rep.phone}
              onChange={e => setRep({ ...rep, phone: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            Add Representative
          </button>
        </form>
      )}
    </div>
  )
}

