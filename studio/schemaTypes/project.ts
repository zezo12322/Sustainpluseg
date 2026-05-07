import {defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Projects',
  type: 'document',
  fields: [
    defineField({
      name: 'titleEn',
      title: 'Title - English',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'titleAr',
      title: 'Title - Arabic',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Description - English',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'descriptionAr',
      title: 'Description - Arabic',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categoryEn',
      title: 'Category - English',
      type: 'string',
    }),
    defineField({
      name: 'categoryAr',
      title: 'Category - Arabic',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Project Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Home Page?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'titleEn',
      subtitle: 'categoryEn',
      media: 'image',
    },
  },
})