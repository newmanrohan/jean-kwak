import Link from 'next/link'
import { client, allProjectsQuery } from '@/lib/sanity'

export const revalidate = 60

interface Project {
  _id: string
  title: string
  slug: string
}

export default async function ProjectIndexPage() {
  const projects: Project[] = await client.fetch(allProjectsQuery)

  return (
    <main className="pt-24 px-6 pb-16 max-w-xl">
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <Link
              href={`/${project.slug}`}
              className="block text-sm py-2 hover:text-black/50 transition-colors"
            >
              {project.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
