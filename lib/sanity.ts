import { createClient, groq } from 'next-sanity'
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  useCdn: false,
  perspective: 'published',
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Queries

export const allProjectsQuery = groq`
  *[_type == "project"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
`

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(featuredOrder asc) {
    _id,
    title,
    "slug": slug.current,
    images[] {
      caption,
      image
    }
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    images[] {
      caption,
      image
    },
    location,
    year,
    builder,
    photography,
    landscape,
    styling,
    description
  }
`

export const infoQuery = groq`
  *[_type == "info"][0] {
    bio,
    phone,
    email,
    instagram,
    facebook
  }
`

export const allSlugsQuery = groq`
  *[_type == "project"] { "slug": slug.current }
`
