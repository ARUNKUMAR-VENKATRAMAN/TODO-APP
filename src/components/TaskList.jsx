import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:5000/api/contacts'

const ContactList = ()=>{
  const [contacts, setContacts] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNo, setPhoneNo] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [contactToDelete, setContactToDelete] = useState(null)
  const [contactToEdit, setContactToEdit] = useState(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhoneNo, setEditPhoneNo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  // Fetch contacts from backend on component mount
  useEffect(() => {
    fetchContacts()
  }, [])

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
      console.error('Error fetching contacts:', err)
    } finally {
      setLoading(false)
    }
  }

  // Validation function
  const validateContact = (name, email, phoneNo) => {
    const errors = {}
    
    // Name validation
    if (!name.trim()) {
      errors.name = 'Name is required'
    }
    
    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Invalid email format'
    }
    
    // Phone number validation - only digits, min 10 digits
    if (!phoneNo.trim()) {
      errors.phoneNo = 'Phone number is required'
    } else if (!/^\d{10,15}$/.test(phoneNo.trim())) {
      errors.phoneNo = 'Phone number must contain only 10-15 digits'
    }
    
    return errors
  }

  // Handle phone input to allow only numbers
  const handlePhoneInput = (value) => {
    // Remove any non-digit characters
    const numbersOnly = value.replace(/\D/g, '')
    setPhoneNo(numbersOnly)
  }

  // Handle edit phone input to allow only numbers
  const handleEditPhoneInput = (value) => {
    // Remove any non-digit characters
    const numbersOnly = value.replace(/\D/g, '')
    setEditPhoneNo(numbersOnly)
  }

  const handleAddContact = async () => {
    // Validate inputs
    const errors = validateContact(name, email, phoneNo)
    setValidationErrors(errors)
    
    // If there are validation errors, don't proceed
    if (Object.keys(errors).length > 0) {
      setError('Please fix the validation errors')
      return
    }

    try {
      setError(null)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim(), 
          phoneNo: phoneNo.trim() 
        }),
      })

      if (!response.ok) throw new Error('Failed to add contact')
      
      const newContact = await response.json()
      setContacts([...contacts, newContact])
      setName('')
      setEmail('')
      setPhoneNo('')
      setValidationErrors({})
    } catch (err) {
      setError('Failed to add contact')
      console.error('Error adding contact:', err)
    }
  }

  const openDeleteModal = (contact) => {
    setContactToDelete(contact)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (contactToDelete) {
      try {
        setError(null)
        const response = await fetch(`${API_URL}/${contactToDelete._id}`, {
          method: 'DELETE',
        })

        if (!response.ok) throw new Error('Failed to delete contact')
        
        setContacts(contacts.filter(contact => contact._id !== contactToDelete._id))
      } catch (err) {
        setError('Failed to delete contact')
        console.error('Error deleting contact:', err)
      }
    }
    setShowDeleteModal(false)
    setContactToDelete(null)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setContactToDelete(null)
  }

  const openEditModal = (contact) => {
    setContactToEdit(contact)
    setEditName(contact.name)
    setEditEmail(contact.email)
    setEditPhoneNo(contact.phoneNo)
    setShowEditModal(true)
  }

  const confirmEdit = async () => {
    // Validate inputs
    const errors = validateContact(editName, editEmail, editPhoneNo)
    
    // If there are validation errors, don't proceed
    if (Object.keys(errors).length > 0) {
      setError('Please fix the validation errors: ' + Object.values(errors).join(', '))
      return
    }

    if (contactToEdit) {
      try {
        setError(null)
        const response = await fetch(`${API_URL}/${contactToEdit._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            name: editName.trim(), 
            email: editEmail.trim(), 
            phoneNo: editPhoneNo.trim() 
          }),
        })

        if (!response.ok) throw new Error('Failed to update contact')
        
        const updatedContact = await response.json()
        setContacts(contacts.map(contact => 
          contact._id === contactToEdit._id ? updatedContact : contact
        ))
      } catch (err) {
        setError('Failed to update contact')
        console.error('Error updating contact:', err)
      }
    }
    setShowEditModal(false)
    setContactToEdit(null)
    setEditName('')
    setEditEmail('')
    setEditPhoneNo('')
  }

  const cancelEdit = () => {
    setShowEditModal(false)
    setContactToEdit(null)
    setEditName('')
    setEditEmail('')
    setEditPhoneNo('')
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            CONTACT DETAILS
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Manage your contacts efficiently</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Input Section */}
          <div className="bg-linear-to-r from-blue-500 to-purple-500 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="sm:col-span-2 lg:col-span-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Your Name"
                  className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border-2 ${validationErrors.name ? 'border-red-500' : 'border-transparent'} rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white shadow-lg text-gray-800 placeholder-gray-400 text-sm sm:text-base`}
                />
                {validationErrors.name && (
                  <p className="text-red-200 text-xs sm:text-sm mt-1 ml-1">{validationErrors.name}</p>
                )}
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border-2 ${validationErrors.email ? 'border-red-500' : 'border-transparent'} rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white shadow-lg text-gray-800 placeholder-gray-400 text-sm sm:text-base`}
                />
                {validationErrors.email && (
                  <p className="text-red-200 text-xs sm:text-sm mt-1 ml-1">{validationErrors.email}</p>
                )}
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <input
                  type="tel"
                  value={phoneNo}
                  onChange={(e) => handlePhoneInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddContact()}
                  placeholder="Enter Your Number"
                  maxLength="15"
                  className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 bg-white border-2 ${validationErrors.phoneNo ? 'border-red-500' : 'border-transparent'} rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-white shadow-lg text-gray-800 placeholder-gray-400 text-sm sm:text-base`}
                />
                {validationErrors.phoneNo && (
                  <p className="text-red-200 text-xs sm:text-sm mt-1 ml-1">{validationErrors.phoneNo}</p>
                )}
              </div>
              <button
                onClick={handleAddContact}
                disabled={loading}
                className="sm:col-span-2 lg:col-span-1 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-white-600 rounded-lg hover:bg-gray-100 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Add Contact
              </button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            {loading && contacts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">⏳</div>
                <p className="text-gray-500 text-xl font-medium">Loading contacts...</p>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead className="bg-linear-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-gray-700 w-24">S.No</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Name</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700">Phone No</th>
                      <th className="px-6 py-4 text-left font-bold text-gray-700 w-64">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact, index) => (
                      <tr key={contact._id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150">
                        <td className="px-6 py-5 text-gray-700 font-medium">{index + 1}</td>
                        <td className="px-6 py-5">
                          <span className="text-gray-800">{contact.name}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-gray-800">{contact.email}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-gray-800">{contact.phoneNo}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openEditModal(contact)}
                              className="px-5 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(contact)}
                              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {contacts.length === 0 && !loading && (
                  <div className="text-center py-16">
                    <div className="text-gray-400 text-6xl mb-4">👤</div>
                    <p className="text-gray-500 text-xl font-medium">No contacts yet!</p>
                    <p className="text-gray-400 mt-2">Add your first contact above to get started</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {loading && contacts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-5xl mb-4">⏳</div>
                <p className="text-gray-500 text-lg font-medium">Loading contacts...</p>
              </div>
            ) : contacts.length === 0 && !loading ? (
              <div className="text-center py-16">
                <div className="text-gray-400 text-5xl mb-4">👤</div>
                <p className="text-gray-500 text-lg font-medium">No contacts yet!</p>
                <p className="text-gray-400 mt-2 text-sm">Add your first contact above to get started</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {contacts.map((contact, index) => (
                  <div key={contact._id} className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">#{index + 1}</span>
                          <h3 className="text-lg font-bold text-gray-800">{contact.name}</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-gray-700 break-all">{contact.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-sm text-gray-700">{contact.phoneNo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => openEditModal(contact)}
                        className="flex-1 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 font-semibold shadow-md transition-all duration-200 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(contact)}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold shadow-md transition-all duration-200 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform animate-scale-in">
            <div className="text-center mb-6">
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Delete Contact</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-2">Are you sure you want to delete this contact?</p>
              {contactToDelete && (
                <div className="text-gray-800 font-semibold bg-gray-100 px-4 py-3 rounded-lg space-y-1 text-sm sm:text-base">
                  <p className="text-left break-all"><span className="text-gray-600">Name:</span> {contactToDelete.name}</p>
                  <p className="text-left break-all"><span className="text-gray-600">Email:</span> {contactToDelete.email}</p>
                  <p className="text-left"><span className="text-gray-600">Phone:</span> {contactToDelete.phoneNo}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition-colors duration-200 text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform animate-scale-in">
            <div className="mb-6">
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-4">Edit Contact</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name *"
                  className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm sm:text-base"
                  autoFocus
                />
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Email *"
                  className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm sm:text-base"
                />
                <input
                  type="tel"
                  value={editPhoneNo}
                  onChange={(e) => handleEditPhoneInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && confirmEdit()}
                  placeholder="Phone No (10-15 digits) *"
                  maxLength="15"
                  className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelEdit}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-colors duration-200 text-sm sm:text-base"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

export default ContactList;