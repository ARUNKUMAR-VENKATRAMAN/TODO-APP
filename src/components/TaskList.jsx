import { useState, useEffect } from 'react'

// const API_URL = 'http://localhost:5000/api/contacts' 
const API_URL = 'https://todo-app-2-4264.onrender.com/api/contacts' 

const ContactList = ()=>{
  const [contacts, setContacts] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNo, setPhoneNo] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [contactToDelete, setContactToDelete] = useState(null)
  const [contactToEdit, setContactToEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => { fetchContacts() }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Failed to fetch contacts')
      const data = await response.json()
      setContacts(data)
    } catch (err) {
      setError('Failed to load contacts. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }

  const validateContact = (name, email, phoneNo) => {
    const errors = {}
    if (!name.trim()) errors.name = 'Name is required'
    if (!email.trim()) { errors.email = 'Email is required' }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { errors.email = 'Invalid email format' }
    if (!phoneNo.trim()) { errors.phoneNo = 'Phone number is required' }
    else if (!/^\d{10,15}$/.test(phoneNo.trim())) { errors.phoneNo = 'Phone number must contain only 10-15 digits' }
    return errors
  }

  const handlePhoneInput = (value) => setPhoneNo(value.replace(/\D/g, ''))

  const handleAddContact = async () => {
    const errors = validateContact(name, email, phoneNo)
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) { setError('Please fix the validation errors'); return }
    try {
      setError(null)
      setIsSubmitting(true)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phoneNo: phoneNo.trim() }),
      })
      if (!response.ok) throw new Error('Failed to add contact')
      const newContact = await response.json()
      setContacts([...contacts, newContact])
      setName(''); setEmail(''); setPhoneNo(''); setValidationErrors({})
    } catch (err) {
      setError('Failed to add contact')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openDeleteModal = (contact) => { setContactToDelete(contact); setShowDeleteModal(true) }

  const confirmDelete = async () => {
    if (!contactToDelete) return
    setIsSubmitting(true)
    try {
      setError(null)
      const response = await fetch(`${API_URL}/${contactToDelete._id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete contact')
      setContacts(contacts.filter(contact => contact._id !== contactToDelete._id))
    } catch (err) {
      setError('Failed to delete contact: ' + err.message)
    } finally {
      setIsSubmitting(false); setShowDeleteModal(false); setContactToDelete(null)
    }
  }

  const cancelDelete = () => { setShowDeleteModal(false); setContactToDelete(null) }
  const openEditModal = (contact) => { setContactToEdit(contact); setShowEditModal(true) }
  const closeEditModal = () => { setShowEditModal(false); setContactToEdit(null) }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-mono">

      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-xs tracking-[0.3em] uppercase text-gray-500">Contact Management</span>
        </div>
        <span className="text-xs text-gray-400 tracking-widest">CONTACTS — v1.0</span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded text-xs tracking-wide flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold ml-4">×</button>
          </div>
        )}

        {/* Form Panel */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm tracking-[0.2em] uppercase text-gray-500">— New Contact</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[0.25em] uppercase text-gray-400">Full Name</label>
                <input
                  type="text" placeholder="Enter full name" value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`bg-gray-50 border text-gray-800 text-sm px-4 py-2.5 rounded focus:outline-none focus:border-emerald-500 focus:bg-white placeholder:text-gray-300 transition-colors ${validationErrors.name ? 'border-red-400' : 'border-gray-300'}`}
                />
                {validationErrors.name && <p className="text-red-500 text-[10px] mt-0.5">{validationErrors.name}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[0.25em] uppercase text-gray-400">Email Address</label>
                <input
                  type="email" placeholder="Enter email address" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`bg-gray-50 border text-gray-800 text-sm px-4 py-2.5 rounded focus:outline-none focus:border-emerald-500 focus:bg-white placeholder:text-gray-300 transition-colors ${validationErrors.email ? 'border-red-400' : 'border-gray-300'}`}
                />
                {validationErrors.email && <p className="text-red-500 text-[10px] mt-0.5">{validationErrors.email}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[0.25em] uppercase text-gray-400">Phone Number</label>
                <input
                  type="tel" placeholder="Enter phone number" value={phoneNo} maxLength="15"
                  onChange={(e) => handlePhoneInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddContact()}
                  className={`bg-gray-50 border text-gray-800 text-sm px-4 py-2.5 rounded focus:outline-none focus:border-emerald-500 focus:bg-white placeholder:text-gray-300 transition-colors ${validationErrors.phoneNo ? 'border-red-400' : 'border-gray-300'}`}
                />
                {validationErrors.phoneNo && <p className="text-red-500 text-[10px] mt-0.5">{validationErrors.phoneNo}</p>}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddContact} disabled={loading || isSubmitting}
                className="px-5 py-2 text-xs tracking-widest uppercase bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Adding...' : '+ Add Contact'}
              </button>
            </div>
          </div>
        </div>

        {/* Table Panel */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm tracking-[0.2em] uppercase text-gray-500">— All Contacts</h2>
            <span className="text-xs text-gray-400">{contacts.length} entries</span>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            {loading && contacts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-xs tracking-widest uppercase">Loading contacts...</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {['#', 'Name', 'Email', 'Phone No', 'Actions'].map(col => (
                      <th key={col} className="px-5 py-3 text-left text-[10px] tracking-[0.25em] uppercase text-gray-400 font-normal">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-xs tracking-widest uppercase">No contacts found</td>
                    </tr>
                  ) : (
                    contacts.map((contact, index) => (
                      <tr key={contact._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 text-gray-400 text-xs">{String(index + 1).padStart(2, '0')}</td>
                        <td className="px-5 py-3.5 text-gray-800 font-medium">{contact.name}</td>
                        <td className="px-5 py-3.5 text-gray-500">{contact.email}</td>
                        <td className="px-5 py-3.5 text-gray-500">{contact.phoneNo}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditModal(contact)} disabled={isSubmitting}
                              className="px-3 py-1.5 text-[10px] tracking-widest uppercase bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >Edit</button>
                            <button
                              onClick={() => openDeleteModal(contact)} disabled={isSubmitting}
                              className="px-3 py-1.5 text-[10px] tracking-widest uppercase bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {loading && contacts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-xs tracking-widest uppercase">Loading contacts...</p>
              </div>
            ) : contacts.length === 0 && !loading ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-xs tracking-widest uppercase">No contacts found</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {contacts.map((contact, index) => (
                  <div key={contact._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-gray-400 tracking-widest">#{String(index + 1).padStart(2, '0')}</span>
                      <h3 className="text-sm font-medium text-gray-800">{contact.name}</h3>
                    </div>
                    <div className="space-y-1 mb-3">
                      <p className="text-xs text-gray-500">{contact.email}</p>
                      <p className="text-xs text-gray-500">{contact.phoneNo}</p>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => openEditModal(contact)} disabled={isSubmitting}
                        className="flex-1 py-1.5 text-[10px] tracking-widest uppercase bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >Edit</button>
                      <button
                        onClick={() => openDeleteModal(contact)} disabled={isSubmitting}
                        className="flex-1 py-1.5 text-[10px] tracking-widest uppercase bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && contactToDelete && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) cancelDelete() }}
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-md w-full p-6 sm:p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <h2 className="text-sm tracking-[0.2em] uppercase text-gray-600">— Delete Contact</h2>
              </div>
              <p className="text-xs text-gray-400 tracking-wide mb-4">Are you sure you want to delete this contact? This action cannot be undone.</p>
              <div className="bg-gray-50 border border-gray-200 rounded px-4 py-3 space-y-1.5 text-xs">
                <p className="text-gray-700"><span className="text-gray-400 tracking-widest uppercase text-[10px]">Name</span><span className="mx-2 text-gray-300">—</span>{contactToDelete.name}</p>
                <p className="text-gray-700 break-all"><span className="text-gray-400 tracking-widest uppercase text-[10px]">Email</span><span className="mx-2 text-gray-300">—</span>{contactToDelete.email}</p>
                <p className="text-gray-700"><span className="text-gray-400 tracking-widest uppercase text-[10px]">Phone</span><span className="mx-2 text-gray-300">—</span>{contactToDelete.phoneNo}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete} disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 text-xs tracking-widest uppercase bg-gray-100 hover:bg-gray-200 text-gray-600 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >Cancel</button>
              <button
                onClick={confirmDelete} disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 text-xs tracking-widest uppercase bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >{isSubmitting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && contactToEdit && (
        <EditContactModal
          key={contactToEdit._id}
          contact={contactToEdit}
          onClose={closeEditModal}
          onSave={(updatedContact) => {
            setContacts(contacts.map(c => c._id === updatedContact._id ? updatedContact : c))
            closeEditModal()
          }}
          apiUrl={API_URL}
        />
      )}
    </div>
  )
}

const EditContactModal = ({ contact, onClose, onSave, apiUrl }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phoneNo: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (contact) setFormData({ name: contact.name || '', email: contact.email || '', phoneNo: contact.phoneNo || '' })
  }, [contact])

  const handleChange = (field, value) => {
    if (field === 'phoneNo') value = value.replace(/\D/g, '')
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateContact = (name, email, phoneNo) => {
    const errors = {}
    if (!name.trim()) errors.name = 'Name is required'
    if (!email.trim()) { errors.email = 'Email is required' }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { errors.email = 'Invalid email format' }
    if (!phoneNo.trim()) { errors.phoneNo = 'Phone number is required' }
    else if (!/^\d{10,15}$/.test(phoneNo.trim())) { errors.phoneNo = 'Phone number must contain only 10-15 digits' }
    return errors
  }

  const handleSave = async () => {
    const errors = validateContact(formData.name, formData.email, formData.phoneNo)
    if (Object.keys(errors).length > 0) { setError('Please fix: ' + Object.values(errors).join(', ')); return }
    setIsSubmitting(true); setError(null)
    try {
      const response = await fetch(`${apiUrl}/${contact._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name.trim(), email: formData.email.trim(), phoneNo: formData.phoneNo.trim() }),
      })
      if (!response.ok) throw new Error('Failed to update contact')
      const updatedContact = await response.json()
      onSave(updatedContact)
    } catch (err) {
      setError('Failed to update: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget && !isSubmitting) onClose() }}
    >
      <div className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-md w-full p-6 sm:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <h2 className="text-sm tracking-[0.2em] uppercase text-gray-600">— Edit Contact</h2>
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-500 border border-blue-200 rounded ml-auto">Editing Mode</span>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-500 px-3 py-2 rounded mb-4 text-xs tracking-wide">{error}</div>
          )}
          <div className="space-y-3">
            {[
              { field: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter full name' },
              { field: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter email address' },
              { field: 'phoneNo', label: 'Phone Number (10–15 digits)', type: 'tel', placeholder: 'Enter phone number' },
            ].map(({ field, label, type, placeholder }) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-[10px] tracking-[0.25em] uppercase text-gray-400">{label}</label>
                <input
                  type={type} value={formData[field]} placeholder={placeholder}
                  maxLength={field === 'phoneNo' ? '15' : undefined}
                  disabled={isSubmitting} autoFocus={field === 'name'}
                  onChange={(e) => handleChange(field, e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !isSubmitting) { e.preventDefault(); handleSave() } }}
                  className="bg-gray-50 border border-gray-300 text-gray-800 text-sm px-4 py-2.5 rounded focus:outline-none focus:border-blue-400 focus:bg-white placeholder:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button" onClick={onClose} disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 text-xs tracking-widest uppercase bg-gray-100 hover:bg-gray-200 text-gray-600 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >Cancel</button>
          <button
            type="button" onClick={handleSave} disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 text-xs tracking-widest uppercase bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >{isSubmitting ? 'Saving...' : 'Save Record'}</button>
        </div>
      </div>
    </div>
  )
}

export default ContactList;