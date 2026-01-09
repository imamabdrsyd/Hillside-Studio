interface HeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export default function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3 bg-gray-100 px-4 py-2.5 rounded-xl flex-1 mr-6">
        <span>🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transactions..."
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center font-semibold text-indigo-600">
          IM
        </div>
        <span className="font-semibold text-sm">Imam</span>
      </div>
    </header>
  )
}
