export const getStatusLessonColor = (status: string) => {
  if (status === 'Taslak') return 'from-gray-400/20 via-gray-500/20 to-gray-600/20'
  else if (status === 'Planlanıyor') return 'from-blue-400/20 via-blue-500/20 to-blue-600/20'
  else if (status === 'İşleme Alındı') return 'from-amber-400/20 via-amber-500/20 to-amber-600/20'
  else if (status === 'Tamamlandı') return 'from-green-400/20 via-green-500/20 to-green-600/20'
}

export const formatDate = (dateString: any) => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''

    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch (error) {
    return ''
  }
}

export function formatTimeWithDateObject(isoString: any) {
  if (!isoString) return '00:00'

  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return '00:00'

    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  } catch (error) {
    return '00:00'
  }
}
