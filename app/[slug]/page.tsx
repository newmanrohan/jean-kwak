import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'
import { client, projectBySlugQuery, allSlugsQuery } from '@/lib/sanity'
import GallerySlider from '@/components/GallerySlider'
import ProjectInfo from '@/components/ProjectInfo'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(allSlugsQuery)
  return slugs.filter((s) => s.slug).map((s) => ({ slug: s.slug }))
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = await client.fetch(projectBySlugQuery, { slug })

  if (!project) {
    notFound()
  }

  const images = project.images ?? []

  return (
    <main className="pt-14">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] min-h-[calc(100vh-3.5rem)]">
        {/* Gallery */}
        <div className="relative">
          {images.length > 0 ? (
            <GallerySlider images={images} />
          ) : (
            <div className="flex items-center justify-center h-64 bg-black/5">
              <span className="text-sm text-black/30">No images</span>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="px-6 py-8 lg:border-l border-black/10 space-y-8">
          <h1 className="text-sm tracking-wide">{project.title}</h1>

          <ProjectInfo
            location={project.location}
            year={project.year}
            builder={project.builder}
            photography={project.photography}
            landscape={project.landscape}
            styling={project.styling}
          />

          {project.description && project.description.length > 0 && (
            <div className="text-sm leading-relaxed prose prose-sm max-w-none">
              <PortableText value={project.description} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
