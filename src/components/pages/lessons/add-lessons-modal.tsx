'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import FormInput from './feedbacks/form-input'
import FormTextarea from './feedbacks/form-textarea'
import { lessonSchema } from '@/types/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { onSubmit } from '@/actions/lessons'
import React from 'react'
import { Lesson } from '@/payload-types'

export function AddLessons() {
  const [open, setOpen] = React.useState(false)
  const form = useForm<Lesson>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: '',
      description: '',
    },
    mode: 'onChange',
  })
  const handleFormSubmit = form.handleSubmit((data) => {
    onSubmit(data)
    form.reset()
    setOpen(false)
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <DialogTrigger asChild>
          <Button variant="outline">Ders Ekle</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Ders Ekle</DialogTitle>
              <DialogDescription>
                Eklediğini dersler planlama aşamasına eklenecektir. Ekleme sebebinizi açıkça
                belirtiniz.
              </DialogDescription>
            </DialogHeader>

            <FormInput
              type="text"
              form={form}
              name="name"
              placeholder="Ders Adı"
              title="Ders Adı"
              required
            />
            <FormTextarea
              form={form}
              name="description"
              placeholder="Ders Açıklaması"
              title="Ders Açıklaması"
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">İptal</Button>
              </DialogClose>
              <Button type="submit">Ekle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  )
}
