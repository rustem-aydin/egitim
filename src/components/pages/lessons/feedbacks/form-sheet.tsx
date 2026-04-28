import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Plus } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UseFormReturn, FieldValues } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

interface SheetProps<T extends FieldValues = any> {
  button_title: string
  title: string
  description: string
  children: React.ReactNode
  form: UseFormReturn<T>
  onSubmit: (values: T) => void
}

const FormSheet = <T extends FieldValues = any>({
  button_title = 'Ekle',
  children,
  description = 'Veri Ekle',
  title = 'Ekle',
  form,
  onSubmit,
}: SheetProps<T>) => {
  const handleFormSubmit = form.handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="size-4" />
          {button_title}
        </Button>
      </SheetTrigger>
      <SheetContent className="mb-24">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <ScrollArea className="h-[800px] w-full">
            <form onSubmit={handleFormSubmit} className="space-y-4 max-w-3xl px-4 mx-auto">
              {children}
            </form>
          </ScrollArea>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default FormSheet
