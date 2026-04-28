'use client'

import { useState } from 'react'

export const ReminderButton = ({ rowData }: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  // rowData.lessons, relationship (hasMany) olduğu için bir array (veya array-like) olmalı
  const hasLessons =
    rowData?.lessons &&
    (Array.isArray(rowData.lessons) ? rowData.lessons.length > 0 : Boolean(rowData.lessons))

  const sendReminder = async () => {
    setIsLoading(true)
    setStatusMessage('')

    try {
      const res = await fetch(`/api/users/${rowData.id}/send-reminder`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()

      if (res.ok) {
        setStatusMessage('Mail Gönderildi ✅')
      } else {
        setStatusMessage(data.error || 'Hata ❌')
      }
    } catch (error) {
      setStatusMessage('Bağlantı Hatası ❌')
    } finally {
      setIsLoading(false)
    }
  }

  if (!hasLessons) {
    return <span style={{ color: '#999', fontSize: '12px' }}>Ders Yok</span>
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        onClick={sendReminder}
        disabled={isLoading || statusMessage.includes('✅')}
        style={{
          backgroundColor: statusMessage.includes('✅') ? '#e0e0e0' : '#3b82f6',
          color: statusMessage.includes('✅') ? '#666' : 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: statusMessage ? 'not-allowed' : 'pointer',
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        {isLoading ? 'Gönderiliyor...' : 'Hatırlat'}
      </button>
      {statusMessage && <span style={{ fontSize: '11px' }}>{statusMessage}</span>}
    </div>
  )
}
