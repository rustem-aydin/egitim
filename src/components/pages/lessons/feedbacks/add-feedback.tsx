'use client'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import FormStars from './form-stars'
import { Feedback } from '@/payload-types'
import FormSheet from './form-sheet'
import { onSubmit } from '@/actions/server/feedbacks'
import { Button } from '@/components/ui/button'
import FormTextarea from './form-textarea'

const AddComment = ({ user_id, id }: { user_id: number; id: number }) => {
  const form = useForm<Feedback>({
    defaultValues: {
      comment_text: '',
      content_meets_expectations: 0,
      duration_and_tempo_suitability: 0,
      overall_satisfaction: 0,
      perceived_knowledge_increase: 0,
      practical_apps_and_examples: 0,
      recommendation_to_colleagues: 0,
      topics_contribution_to_job: 0,
      trainer_expertise_and_delivery: 0,
      training_environment_suitability: 0,
      training_materials_usefulness: 0,
    },
    mode: 'onChange',
  })

  return (
    <FormSheet
      form={form}
      onSubmit={(values) => {
        onSubmit({ ...values, user_id, lesson: id })
        form.reset()
      }}
      button_title="Değerlendirme"
      title="Değerlendirme"
      description="Eğitim Değerlendirme"
    >
      <div className="gap-2 space-y-4 border-b-2 ">
        <FormTextarea form={form} name="comment_text" placeholder="Yorum Giriniz" title="Yorum *" />
        <FormStars
          form={form}
          name="content_meets_expectations"
          title="Eğitim içeriği beklentilerimi karşıladı."
        />
        <Separator></Separator>
        <FormStars
          form={form}
          name="topics_contribution_to_job"
          title="Eğitimde verilen konular görevime katkı sağlayacak nitelikteydi."
        />
        <Separator></Separator>

        <FormStars
          form={form}
          name="training_materials_usefulness"
          title="Eğitim materyalleri (slaytlar, notlar, videolar vb.) yeterli ve faydalıydı."
        />
        <Separator></Separator>

        <FormStars
          form={form}
          name="trainer_expertise_and_delivery"
          title="Eğitmenin konuya hâkimiyeti ve anlatım tarzı yeterliydi."
        />
        <Separator></Separator>

        <FormStars
          form={form}
          name="duration_and_tempo_suitability"
          title="Eğitim süresi ve tempo, konuların anlaşılması için uygundu."
        />
        <Separator></Separator>

        <FormStars
          form={form}
          name="practical_apps_and_examples"
          title="Eğitim sırasında kullanılan uygulamalar ve örnekler faydalı oldu."
        />
        <Separator></Separator>

        <FormStars
          form={form}
          name="perceived_knowledge_increase"
          title="Eğitim sonunda görev alanımdaki bilgi seviyemin arttığını düşünüyorum."
        />
        <Separator></Separator>

        <FormStars
          form={form}
          name="training_environment_suitability"
          title="Eğitim ortamı (çevrim içi platform / sınıf ortamı, teknik altyapı) uygundu."
        />
        <Separator></Separator>

        <FormStars
          form={form}
          name="overall_satisfaction"
          title="Eğitimden genel memnuniyetim yüksektir."
        />
        <Separator></Separator>

        <FormStars
          form={form}
          name="recommendation_to_colleagues"
          title="Bu eğitimi meslektaşlarıma tavsiye ederim."
        />
        <Separator></Separator>
        <Button type="submit" className="w-full">
          {'Yorumla'}
        </Button>
      </div>
    </FormSheet>
  )
}

export default AddComment
