'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  id: number
  name: string
  email: string
}

type DrillGroup = {
  id: number
  name: string
}

type Drill = {
  id: number
  name: string
  description?: string
  location?: string
  date_from?: string
  date_to?: string
  info_url?: string
  participants?: User[]
  group_id?: DrillGroup
}

export default function DrillsListView() {
  const router = useRouter()

  const [drills, setDrills] = useState<Drill[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [totalDocs, setTotalDocs] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  // Kullanıcıları çek
  useEffect(() => {
    fetch('/api/users?limit=100&depth=0')
      .then((res) => res.json())
      .then((data) => setUsers(data.docs || []))
      .catch(console.error)
  }, [])

  const fetchDrills = useCallback(async (userId: string, currentPage: number) => {
    setLoading(true)
    try {
      let url = `/api/drills?depth=1&limit=${limit}&page=${currentPage}`

      if (userId) {
        url += `&where[participants][contains]=${userId}`
      }

      const res = await fetch(url)
      const data = await res.json()
      setDrills(data.docs || [])
      setTotalDocs(data.totalDocs || 0)
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDrills(selectedUserId, page)
  }, [selectedUserId, page, fetchDrills])

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(e.target.value)
    setPage(1)
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div
      style={{
        padding: '32px',
        fontFamily: 'var(--font-body)',
        color: 'var(--theme-text)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Tatbikatlar</h1>
          <p style={{ margin: '4px 0 0', opacity: 0.6, fontSize: '14px' }}>
            {totalDocs} tatbikat bulundu
          </p>
        </div>

        <button
          onClick={() => router.push('/admin/collections/drills/create')}
          style={{
            padding: '8px 18px',
            background: 'var(--theme-elevation-1000)',
            color: 'var(--theme-bg)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          + Yeni Tatbikat
        </button>
      </div>

      {/* Filtre */}
      <div
        style={{
          background: 'var(--theme-elevation-50)',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <label style={{ fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }}>
          Katılımcıya Göre Filtrele:
        </label>
        <select
          value={selectedUserId}
          onChange={handleUserChange}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: '6px',
            background: 'var(--theme-bg)',
            color: 'var(--theme-text)',
            fontSize: '14px',
            minWidth: '220px',
            cursor: 'pointer',
          }}
        >
          <option value="">— Tüm Tatbikatlar —</option>
          {users.map((user) => (
            <option key={user.id} value={String(user.id)}>
              {user.name || user.email}
            </option>
          ))}
        </select>

        {selectedUserId && (
          <button
            onClick={() => {
              setSelectedUserId('')
              setPage(1)
            }}
            style={{
              padding: '8px 12px',
              background: 'transparent',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              color: 'var(--theme-text)',
            }}
          >
            ✕ Filtreyi Temizle
          </button>
        )}
      </div>

      {/* Tablo */}
      <div
        style={{
          background: 'var(--theme-elevation-0)',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', opacity: 0.5 }}>Yükleniyor...</div>
        ) : drills.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', opacity: 0.5 }}>
            Tatbikat bulunamadı.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--theme-elevation-150)',
                  background: 'var(--theme-elevation-50)',
                }}
              >
                {[
                  'Tatbikat Adı',
                  'Açıklama',
                  'Konum',
                  'Başlangıç',
                  'Bitiş',
                  'Katılımcılar',
                  '',
                ].map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      opacity: 0.6,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drills.map((drill, i) => (
                <tr
                  key={drill.id}
                  style={{
                    borderBottom:
                      i < drills.length - 1 ? '1px solid var(--theme-elevation-100)' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLTableRowElement).style.background =
                      'var(--theme-elevation-50)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLTableRowElement).style.background = 'transparent'
                  }}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{drill.name}</td>
                  <td
                    style={{
                      padding: '14px 16px',
                      opacity: 0.7,
                      fontSize: '13px',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {drill.description || '—'}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px' }}>
                    {drill.location || '—'}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {formatDate(drill.date_from)}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {formatDate(drill.date_to)}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {drill.participants && drill.participants.length > 0 ? (
                        drill.participants.slice(0, 3).map((p) => (
                          <span
                            key={p.id}
                            style={{
                              padding: '2px 8px',
                              background: 'var(--theme-elevation-100)',
                              borderRadius: '999px',
                              fontSize: '12px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {p.name || p.email}
                          </span>
                        ))
                      ) : (
                        <span style={{ opacity: 0.4, fontSize: '13px' }}>—</span>
                      )}
                      {drill.participants && drill.participants.length > 3 && (
                        <span
                          style={{
                            padding: '2px 8px',
                            background: 'var(--theme-elevation-100)',
                            borderRadius: '999px',
                            fontSize: '12px',
                            opacity: 0.6,
                          }}
                        >
                          +{drill.participants.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => router.push(`/admin/collections/drills/${drill.id}`)}
                      style={{
                        padding: '6px 14px',
                        background: 'transparent',
                        border: '1px solid var(--theme-elevation-200)',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: 'var(--theme-text)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Düzenle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '24px',
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '7px 14px',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '6px',
              background: 'transparent',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.4 : 1,
              color: 'var(--theme-text)',
            }}
          >
            ← Önceki
          </button>

          <span style={{ fontSize: '14px', opacity: 0.7 }}>
            {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '7px 14px',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '6px',
              background: 'transparent',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              opacity: page === totalPages ? 0.4 : 1,
              color: 'var(--theme-text)',
            }}
          >
            Sonraki →
          </button>
        </div>
      )}
    </div>
  )
}
