'use client'

import { AddLessonRequest, deleteLessonRequest, isRequest } from '@/actions/lessonRequests'
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
import React, { useEffect, useOptimistic } from 'react'
import FormTextarea from '../feedbacks/form-textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { lessonRequestSchema, LessonRequestsValues } from '@/types/schemas'
import { useRouter } from 'next/navigation'

const LessonRequest = ({ id }: { id: number }) => {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  const [isRequesst, setIsRequesst] = React.useState(false)
  const [optimisticIsRequest, setOptimisticIsRequest] = useOptimistic(isRequesst)

  useEffect(() => {
    const checkRequest = async () => {
      const isReq = await isRequest(id)
      setIsRequesst(isReq)
    }
    checkRequest()
  }, [id])

  const form = useForm<LessonRequestsValues>({
    resolver: zodResolver(lessonRequestSchema),
    defaultValues: {
      description: '',
      lessons: id,
    },
    mode: 'onChange',
  })

  const [isPending, startTransition] = React.useTransition()

  // ✅ Silme — optimistic + server + refresh
  const handleDelete = () => {
    startTransition(async () => {
      setOptimisticIsRequest(false) // ✅ Hemen UI güncelle
      await deleteLessonRequest(id)
      setIsRequesst(false) // ✅ Server sonrası gerçek state
      router.refresh() // ✅ Server cache'i yenile
    })
  }

  // ✅ Talep — optimistic + server + refresh
  const handleFormSubmit = form.handleSubmit(
    (data) => {
      startTransition(async () => {
        setOptimisticIsRequest(true) // ✅ Hemen UI güncelle
        await AddLessonRequest({ description: data.description, lessons: id })
        setIsRequesst(true) // ✅ Server sonrası gerçek state
        setOpen(false)
        form.reset()
        router.refresh() // ✅ Server cache'i yenile
      })
    },
    (errors) => {},
  )

  // ✅ optimisticIsRequest kullan — transition sırasında doğru UI
  if (optimisticIsRequest) {
    return (
      <>
        <Button onClick={handleDelete} variant="destructive" disabled={isPending}>
          {'Talebi Sil'}
        </Button>
      </>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <DialogTrigger asChild>
          <Button variant="outline">Talep Et</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Talep Et</DialogTitle>
              <DialogDescription>
                Talep Etmek istediğiniz ders için açıklama giriniz.
              </DialogDescription>
            </DialogHeader>

            <FormTextarea
              form={form}
              name="description"
              placeholder="Ders Açıklaması"
              title="Ders Talebi Açıklaması"
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">İptal</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Ediliyor...' : 'Talep Et'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  )
}

export default LessonRequest
