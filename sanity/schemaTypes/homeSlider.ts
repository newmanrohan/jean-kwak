import { defineField, defineType } from 'sanity'

export const homeSlider = defineType({
  name: 'homeSlider',
  title: 'Home Slider',
  type: 'document',
  fields: [
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'project',
              title: 'Project',
              type: 'reference',
              to: [{ type: 'project' }],
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: {
              media: 'image',
              title: 'project.title',
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(4).max(10),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Slider' }
    },
  },
})
