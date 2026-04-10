import { client, allProjectsQuery } from '@/lib/sanity'
import ProjectIndexList from '@/components/ProjectIndexList'

export const revalidate = 60

export default async function ProjectIndexPage() {
  const projects = await client.fetch(allProjectsQuery)

  return (
    <main
      style={{
        background: '#F7F2E9',
        minHeight: '100vh',
        paddingTop: '157px',
        paddingBottom: '64px',
      }}
    >
      <ProjectIndexList projects={projects} />
    </main>
  )
}
