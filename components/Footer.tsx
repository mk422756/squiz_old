import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-500">
      <div className="text-center text-white pt-6 text-3xl font-semibold">
        SQUIZ
      </div>
      <div className="p-4">
        <span>
          <Link href="/about">
            <a className="text-white">SQUIZとは</a>
          </Link>
        </span>
        <span className="ml-4">
          <Link href="/">
            <a className="text-white">利用規約</a>
          </Link>
        </span>
      </div>
    </footer>
  )
}
