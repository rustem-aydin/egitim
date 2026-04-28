'use client'

import React from 'react'
import { Button, useDocumentInfo } from '@payloadcms/ui'

export const ReminderButton: React.FC = () => {
  const { id } = useDocumentInfo()

  const handleClick = async () => {
    if (!id) return

    try {
      const res = await fetch(`/api/users/${id}/send-reminder`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      alert(data.message || data.error)
    } catch (err) {
      alert('Bir hata oluştu')
    }
  }

  if (!id) return null

  return (
    <div style={{ margin: '20px 0' }}>
      <Button size="small" onClick={handleClick}>
        📧 Hatırlatma Maili Gönder
      </Button>
    </div>
  )
}
