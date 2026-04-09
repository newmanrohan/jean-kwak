import { client, featuredProjectsQuery } from '@/lib/sanity'
import ProjectSlider from '@/components/ProjectSlider'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const projects = await client.fetch(featuredProjectsQuery)

  if (!projects || projects.length === 0) {
    return (
      <main className="flex items-center justify-center h-full pt-14">
        <p className="text-sm text-black/40">No featured projects.</p>
      </main>
    )
  }

  return (
    <main className="h-full pt-14">
      <div className="h-full">
        <ProjectSlider projects={projects} />
      </div>
    </main>
  )
}
