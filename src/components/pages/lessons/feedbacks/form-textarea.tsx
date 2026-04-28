'use client'
import { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

interface FormInputProps<T extends FieldValues = any> {
  form: UseFormReturn<T>
  name: FieldPath<T>
  placeholder: string
  title: string
  className?: string
  disabled?: boolean
  required?: boolean
}

const FormTextarea = <T extends FieldValues = any>({
  form,
  name,
  placeholder,
  title,
  className,
  disabled = false,
  required = false,
}: FormInputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormTextarea
