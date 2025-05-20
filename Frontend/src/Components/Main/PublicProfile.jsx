import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../Navigation/Navbar'
import Footer from '../Navigation/Footer'

const PublicProfile = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/users/${id}`)
        if (!res.ok) throw new Error('User not found')
        const data = await res.json()
        setUser(data.user)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center text-gray-500">Loading profile...</main>
      <Footer />
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center text-red-500">{error}</main>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto p-6">
        <div className="bg-white shadow rounded-lg p-8 flex flex-col md:flex-row gap-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <img
              src={user.details?.profile_image || '/default-profile.png'}
              alt={`${user.name} ${user.surname}`}
              className="w-48 h-48 rounded-full object-cover border border-gray-300"
            />
          </div>

          {/* User Info */}
          <div className="flex-grow">
            <h1 className="text-4xl font-bold text-gray-900">
              {user.name} {user.surname}
            </h1>
            <div className="mt-4 space-y-3 text-gray-700">
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Phone:</span> {user.phone_number || '-'}</p>
              <p><span className="font-semibold">Birthday:</span> {user.details?.birthday || '-'}</p>
              <p><span className="font-semibold">Gender:</span> {user.details?.gender || '-'}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Bio</h2>
              <p className="text-gray-700">{user.details?.bio || 'No bio available.'}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Skills</h2>
              <p className="text-gray-700">{user.details?.skills_tag || 'No skills listed.'}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Resume</h2>
              {user.details?.resume_link_to_file ? (
                <a
                  href={`http://localhost:8000${user.details.resume_link_to_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  View Resume
                </a>
              ) : (
                <p className="text-gray-500">No resume uploaded.</p>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Social Links</h2>
              <ul className="list-disc list-inside space-y-1 text-blue-600">
                {user.details?.social_links && user.details.social_links.length > 0
                  ? user.details.social_links.map((link, i) =>
                      link ? (
                        <li key={i}>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {link}
                          </a>
                        </li>
                      ) : null
                    )
                  : <li>No social links provided.</li>
                }
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default PublicProfile
