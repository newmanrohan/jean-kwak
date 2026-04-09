import { notFound } from 'next/navigation'
import { client, projectBySlugQuery, allSlugsQuery } from '@/lib/sanity'
import ProjectSlideShow from '@/components/ProjectSlideShow'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(allSlugsQuery)
  return slugs.filter(s => s.slug).map(s => ({ slug: s.slug }))
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params

  const [project, allSlugs] = await Promise.all([
    client.fetch(projectBySlugQuery, { slug }),
    client.fetch(allSlugsQuery),
  ])

  if (!project) notFound()

  const projectNumber =
    (allSlugs as { slug: string }[]).findIndex(s => s.slug === slug) + 1

  return <ProjectSlideShow project={project} projectNumber={projectNumber} />
}
