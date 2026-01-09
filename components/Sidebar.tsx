interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', section: 'General' },
    { id: 'transactions', label: 'Transactions', icon: '📋', section: 'General' },
    { id: 'reports', label: 'Reports', icon: '📊', section: 'General' },
    { id: 'income', label: 'Income Statement', icon: '📈', section: 'Accounting' },
    { id: 'balance', label: 'Balance Sheet', icon: '⚖️', section: 'Accounting' },
    { id: 'cashflow', label: 'Cash Flow', icon: '💰', section: 'Accounting' },
  ]

  const sections = ['General', 'Accounting']

  return (
    <aside className="w-60 bg-white border-r border-gray-200 p-5 flex flex-col fixed h-screen z-50">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl">
          🏔️
        </div>
        <h1 className="text-lg font-bold text-indigo-600">hillside studio</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {sections.map((section) => (
          <div key={section}>
            <p className="text-[10px] font-semibold text-gray-400 uppercase px-3 mb-2 mt-6 first:mt-0">
              {section}
            </p>
            {navItems
              .filter((item) => item.section === section)
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
