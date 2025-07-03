import { useEffect, useState } from 'react';
import { apiHelpers } from '../services/apis';

export default function UserData() {
  const [data, setData] = useState([]);
  const [pageLimit, setPageLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(100);
  const [loading, setLoading] = useState(false);

  // const fetchData = () => {
  //   fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log('Fetched data:', data);
  //       setData(data);
  //     });
  // };

  const fetchData = async (page = 1, limit = 10, search = '') => {
    setLoading(true);
    try {
      const result = await apiHelpers.getPosts({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });

      if (result.success) {
        const jsonData = result.data;

        if (search.trim()) {
          const filteredData = jsonData.filter(
            (item) =>
              item.title.toLowerCase().includes(search.toLowerCase()) ||
              item.body.toLowerCase().includes(search.toLowerCase())
          );
          setData(filteredData);
          setTotalItems(filteredData.length);
          setTotalPages(Math.ceil(filteredData.length / limit));
        } else {
          setData(jsonData);
          setTotalItems(result.total);
          setTotalPages(Math.ceil(result.total / limit));
        }
      } else {
        console.error('API Error:', result.error);
        setData([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setData([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      fetchData(currentPage, pageLimit, searchTerm);
    }
  }, [currentPage, pageLimit, sortBy, sortOrder]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchData(1, pageLimit, searchTerm);
      if (searchTerm) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, pageLimit, sortBy, sortOrder]);

  useEffect(() => {
    fetchData(1, pageLimit, '');
  }, []);

  const handlePageLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setPageLimit(newLimit);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    setCurrentPage(1);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

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

      <div className='mb-4 text-sm text-gray-600'>
        Showing {(currentPage - 1) * pageLimit + 1} to{' '}
        {Math.min(currentPage * pageLimit, totalItems)} of {totalItems} entries
        {searchTerm && ` (filtered results)`}
      </div>

      {loading && (
        <div className='text-center py-4'>
          <div className='inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>
          <span className='ml-2'>Loading...</span>
        </div>
      )}

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

      {totalPages > 1 && (
        <div className='mt-4 flex flex-col sm:flex-row justify-between items-center gap-4'>
          <div className='text-sm text-gray-600'>
            Page {currentPage} of {totalPages}
          </div>
          <div className='flex items-center gap-2'>
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
