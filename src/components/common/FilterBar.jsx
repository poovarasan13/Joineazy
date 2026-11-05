function FilterBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  statusOptions = [],
  sortBy,
  onSortChange,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-colors">
      {/* Title Search Input with Search Icon */}
      <div className="flex-1 relative">
        <label htmlFor="filter-search-input" className="sr-only">
          Search assignments by title
        </label>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          id="filter-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search assignments by title..."
          className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search query"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Status Filter */}
        <div className="w-full sm:w-auto">
          <label htmlFor="filter-status-select" className="sr-only">
            Filter by status
          </label>
          <select
            id="filter-status-select"
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div className="w-full sm:w-auto">
          <label htmlFor="filter-sort-select" className="sr-only">
            Sort by due date
          </label>
          <select
            id="filter-sort-select"
            aria-label="Sort by due date"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
          >
            <option value="earliest">Due: Earliest first</option>
            <option value="latest">Due: Latest first</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
