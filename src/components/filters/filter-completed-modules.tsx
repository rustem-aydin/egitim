'use client'

import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multiselect'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { Module } from '@/payload-types'

interface FilterModulesProps {
  modules: Module[]
  startTransition: React.TransitionStartFunction
}

export default function FilterCompletedModules({ modules, startTransition }: FilterModulesProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // 1. Seçenekleri oluştururken tipi açıkça belirtiyoruz (Option[])
  const options: Option[] = (modules || [])
    .filter((m) => m && (m.code || m.id || m.name))
    .map((m) => ({
      value: String(m.code || m.id || m.name),
      label: String(m.name || m.code || m.id || 'İsimsiz Modül'),
    }))

  const urlValues = searchParams.get('completedModules')?.split(',').filter(Boolean) || []

  // 2. Seçili olanları filtreleyerek buluyoruz
  const selectedOptions = options.filter((opt) => urlValues.includes(opt.value))

  const handleModuleChange = (selected: Option[]) => {
    const params = new URLSearchParams(searchParams.toString())
    const values = selected.map((s) => s.value)

    if (values.length > 0) {
      params.set('completedModules', values.join(','))
    } else {
      params.delete('completedModules')
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="space-y-2">
      <Label>Tamamlanan Modüller</Label>
      <MultipleSelector
        // HATA BURADAYDI: id prop'unu bileşen desteklemiyorsa siliyoruz.
        // Eğer id lazımsa commandProps içine koymayı deneyebilirsin.
        commandProps={{
          label: 'Modül Seçiniz',
        }}
        value={selectedOptions}
        onChange={handleModuleChange}
        defaultOptions={options}
        options={options}
        placeholder="Modül seçin..."
        hideClearAllButton={false}
        hidePlaceholderWhenSelected
        emptyIndicator={
          <p className="text-center text-sm p-4 text-muted-foreground">Modül bulunamadı.</p>
        }
      />
    </div>
  )
}
