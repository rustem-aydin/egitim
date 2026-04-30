import type { CollectionConfig } from 'payload'
import { updateLessonRatingHook } from '../_hooks/Feedbacks'

export const Feedbacks: CollectionConfig = {
  slug: 'feedbacks',
  admin: {
    useAsTitle: 'id',
    group: 'Dersler',
  },
  labels: {
    singular: 'Geri Bildirim',
    plural: 'Geri Bildirimler',
  },
  hooks: {
    afterChange: [updateLessonRatingHook],
  },
  fields: [
    {
      name: 'content_meets_expectations',
      type: 'number',
    },
    {
      name: 'topics_contribution_to_job',
      type: 'number',
    },
    {
      name: 'training_materials_usefulness',
      type: 'number',
    },
    {
      name: 'trainer_expertise_and_delivery',
      type: 'number',
    },
    {
      name: 'duration_and_tempo_suitability',
      type: 'number',
    },
    {
      name: 'practical_apps_and_examples',
      type: 'number',
    },
    {
      name: 'perceived_knowledge_increase',
      type: 'number',
    },
    {
      name: 'training_environment_suitability',
      type: 'number',
    },
    {
      name: 'overall_satisfaction',
      type: 'number',
    },
    {
      name: 'recommendation_to_colleagues',
      type: 'number',
    },
    {
      name: 'user_id', // Supabase'deki user_id ilişkisi
      type: 'relationship',
      relationTo: 'users',
      required: false, // Bu önemli!
    },
    {
      name: 'lesson', // Supabase'deki lesson_id ilişkisi
      type: 'relationship',
      relationTo: 'lessons',
      required: false, // Bu önemli!
    },
    {
      name: 'comment_text',
      type: 'text',
    },
  ],
}
