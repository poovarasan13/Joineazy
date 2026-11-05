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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-colors">
      {/* Title Search Input */}
      <div className="flex-1 relative">
        <label htmlFor="filter-search-input" className="sr-only">
          Search assignments by title
        </label>
        <input
          id="filter-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search assignments by title..."
          className="w-full pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search query"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown Filters (stacked on mobile, inline on tablet/desktop) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Status Filter Dropdown */}
        <div className="w-full sm:w-auto">
          <label htmlFor="filter-status-select" className="sr-only">
            Filter by status
          </label>
          <select
            id="filter-status-select"
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date Sort Dropdown */}
        <div className="w-full sm:w-auto">
          <label htmlFor="filter-sort-select" className="sr-only">
            Sort by due date
          </label>
          <select
            id="filter-sort-select"
            aria-label="Sort by due date"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
          >
            <option value="earliest">Due date: Earliest first</option>
            <option value="latest">Due date: Latest first</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
