import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white">
      <Link href="/" className="text-sm tracking-wide">
        Jean Kwak Architects
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/project-index" className="text-sm tracking-wide">
          Index
        </Link>
        <Link href="/information" className="text-sm tracking-wide">
          Information
        </Link>
      </div>
    </nav>
  )
}
