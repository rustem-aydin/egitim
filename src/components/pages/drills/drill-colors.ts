export type DrillColorSet = {
  bgGradient: string
  textColor: string
  badgeColor: string
}

export const getGroupColors = (color: string) => {
  // Fallback renk
  const base = color || '#f59e0b'

  return {
    // Arka plan gradyanı (düşük opaklık)
    bgGradient: {
      background: '#fdf0d5',
    },
    // Ana metin rengi
    textStyle: {
      color: base,
    },
    // Badge / buton gradyanı
    badgeStyle: {
      background: `linear-gradient(to right, ${base}50, ${base}50)`,
    },
    // Pulse / nokta rengi
    pulseStyle: {
      backgroundColor: base,
    },
    // Büyük blur daire
    blurLgStyle: {
      backgroundColor: base,
    },
    // Küçük blur daire
    blurSmStyle: {
      backgroundColor: `${base}aa`,
    },
    // Ping animasyonu (şeffaf)
    pingStyle: {
      backgroundColor: `${base}bb`,
    },
    // Section border rengi
    sectionStyle: {
      color: base,
      borderColor: base,
    },
  }
}
