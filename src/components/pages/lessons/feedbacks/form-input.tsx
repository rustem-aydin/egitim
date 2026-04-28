'use client'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form'

interface FormInputProps<T extends FieldValues = any> {
  form: UseFormReturn<T>
  name: FieldPath<T>
  placeholder: string
  title: string
  type: string
  className?: string
  disabled?: boolean
  required?: boolean
}

const FormInput = <T extends FieldValues = any>({
  form,
  name,
  placeholder,
  title,
  type,
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
            <Input placeholder={placeholder} type={type} disabled={disabled} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormInput
