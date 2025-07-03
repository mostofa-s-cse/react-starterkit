import { ChangeEvent, useEffect, useState } from 'react';
import { apiHelpers } from '../services/apis';

// ✅ Define the shape of each post item
interface Post {
  id: number;
  title: string;
  body: string;
}

export default function UserData() {
  const [data, setData] = useState<Post[]>([]);
  const [filteredData, setFilteredData] = useState<Post[]>([]);
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(100); // JSONPlaceholder has 100 posts total
  const [loading, setLoading] = useState<boolean>(false);

  // ✅ Fetch data with server-side pagination and search using API service
  const fetchData = async (
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ) => {
    setLoading(true);
    try {
      console.log('Fetching with params:', { page, limit, search });

      // Use the apiHelpers service for cleaner API calls
      const result = await apiHelpers.getPosts({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });

      if (result.success) {
        const jsonData: Post[] = result.data;

        // For demonstration with JSONPlaceholder's limited search,
        // we'll simulate server-side search behavior
        if (search.trim()) {
          // Since JSONPlaceholder's search is limited, we'll filter server results
          const filteredData = jsonData.filter(
            (item) =>
              item.title.toLowerCase().includes(search.toLowerCase()) ||
              item.body.toLowerCase().includes(search.toLowerCase())
          );

          setData(filteredData);
          // For real APIs, you'd get total count from response headers or separate endpoint
          setTotalItems(filteredData.length);
          setTotalPages(Math.ceil(filteredData.length / limit));
        } else {
          setData(jsonData);
          setTotalItems(result.total); // Use total from API response
          setTotalPages(Math.ceil(result.total / limit));
        }

        console.log(
          'Fetched data for page:',
          page,
          'limit:',
          limit,
          'search:',
          search,
          'items:',
          jsonData.length
        );
      } else {
        // Handle API error
        console.error('API Error:', result.error);
        setData([]);
        setTotalItems(0);
        setTotalPages(0);
      }

      setFilteredData([]);
    } catch (error: any) {
      console.error('Unexpected error:', error);
      // Set empty data on error
      setData([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch data when page, pageLimit, or sorting changes (not searchTerm directly)
  useEffect(() => {
    if (!searchTerm) {
      fetchData(currentPage, pageLimit, searchTerm);
    }
  }, [currentPage, pageLimit, sortBy, sortOrder]);

  // ✅ Debounced search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchData(1, pageLimit, searchTerm); // Always start from page 1 for search
      if (searchTerm) {
        setCurrentPage(1);
      }
    }, 500); // 500ms delay for debouncing

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, pageLimit, sortBy, sortOrder]);

  // ✅ Initial data fetch
  useEffect(() => {
    fetchData(1, pageLimit, '');
  }, []); // Only run once on mount

  // ✅ Handle page limit change
  const handlePageLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setPageLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  // ✅ Handle search with debouncing (no immediate API call)
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    // Page reset is handled in useEffect for search
  };

  // ✅ Handle sorting change
  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when changing sort
  };

  // ✅ Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPage = (pageNumber: number) => setCurrentPage(pageNumber);

  // ✅ Get page numbers for pagination display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxPagesToShow / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-6'>
      <h2 className='text-center text-xl font-semibold mb-4'>DataTable</h2>

      <div className='flex flex-wrap justify-between items-center mb-4 gap-4'>
        {/* Sorting Dropdown */}
        <div>
          <label htmlFor='sorting' className='mr-2'>
            Sort by:
          </label>
          <select
            id='sorting'
            className='border rounded p-1'
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value='id'>ID</option>
            <option value='title'>Title</option>
            <option value='body'>Body</option>
            <option value='userId'>User ID</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className='ml-2 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded'
            title={`Currently: ${sortOrder.toUpperCase()}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* Search Input */}
        <div className='relative'>
          <label htmlFor='search' className='mr-2'>
            Search:
          </label>
          <div className='relative inline-block'>
            <input
              type='text'
              id='search'
              className='border rounded p-1 pr-20'
              placeholder='Search by title or body...'
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className='absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                title='Clear search'
              >
                ✕
              </button>
            )}
            {loading && searchTerm && (
              <div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
                <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500'></div>
              </div>
            )}
          </div>
        </div>

        {/* Page Limit Dropdown */}
        <div>
          <label htmlFor='pageLimit' className='mr-2'>
            Page Limit:
          </label>
          <select
            id='pageLimit'
            value={pageLimit}
            onChange={handlePageLimitChange}
            className='border rounded p-1'
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Data Info */}
      <div className='mb-4 text-sm text-gray-600'>
        Showing {(currentPage - 1) * pageLimit + 1} to{' '}
        {Math.min(currentPage * pageLimit, totalItems)} of {totalItems} entries
        {searchTerm && ` (filtered results)`}
      </div>

      {/* Loading State */}
      {loading && (
        <div className='text-center py-4'>
          <div className='inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>
          <span className='ml-2'>Loading...</span>
        </div>
      )}

      {/* Data Table */}
      <table className='min-w-full bg-white border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='py-2 px-4 border'>ID</th>
            <th className='py-2 px-4 border'>Title</th>
            <th className='py-2 px-4 border'>Body</th>
          </tr>
        </thead>
        <tbody>
          {!loading && data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td className='py-2 px-4 border'>{item.id}</td>
                <td className='py-2 px-4 border'>{item.title}</td>
                <td className='py-2 px-4 border'>{item.body}</td>
              </tr>
            ))
          ) : !loading ? (
            <tr>
              <td colSpan={3} className='text-center py-4'>
                No data found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='mt-4 flex flex-col sm:flex-row justify-between items-center gap-4'>
          {/* Page Info */}
          <div className='text-sm text-gray-600'>
            Page {currentPage} of {totalPages}
          </div>

          {/* Pagination Buttons */}
          <div className='flex items-center gap-2'>
            {/* First Page */}
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              First
            </button>

            {/* Previous Page */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className='flex gap-1'>
              {getPageNumbers().map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`px-3 py-1 rounded text-sm ${
                    pageNumber === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            {/* Next Page */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>

            {/* Last Page */}
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
