import { client, homeSliderQuery } from '@/lib/sanity'
import ProjectSlider from '@/components/ProjectSlider'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const slider = await client.fetch(homeSliderQuery)
  const slides = slider?.slides ?? []

  const projects = slides
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((s: any) => s?.project && s?.image)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((s: any) => ({
      _id: s.project._id,
      title: s.project.title,
      slug: s.project.slug,
      images: [{ image: s.image }],
    }))

  if (!projects.length) {
    return (
      <main className="flex items-center justify-center h-full">
        <p className="text-sm text-black/40">No slides configured.</p>
      </main>
    )
  }

  return (
    <main className="h-full">
      <ProjectSlider projects={projects} />
    </main>
  )
}
