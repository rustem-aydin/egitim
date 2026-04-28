'use client' // ← BUNU EKLE

import { FormLabel, FormMessage } from '@/components/ui/form'
import StarRating from '@/components/ui/rating'
import { Controller, FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

interface FormInputProps<T extends FieldValues = any> {
  form: UseFormReturn<T>
  name: FieldPath<T>
  title: string
  className?: string
  disabled?: boolean
  required?: boolean
}

const FormStars = <T extends FieldValues = any>({ form, name, title }: FormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <>
          <FormLabel>{title}</FormLabel>
          <StarRating
            value={Number(field.value)} // form string tutuyor, number’a çevir
            onChange={(val) => field.onChange(String(val))} // seçilen değeri string kaydet
            maxStars={10}
          />
          {/* hata mesajını bağla */}
          <FormMessage>{form.formState.errors[name]?.message as string}</FormMessage>
        </>
      )}
    />
  )
}

export default FormStars
