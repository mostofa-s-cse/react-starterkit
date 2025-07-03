import { useEffect, useState } from 'react';

export default function UserData() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]); // 🔁 Keeps original for search
  const [pageLimit, setPageLimit] = useState(10); // ✅ Page limit state
  const [searchTerm, setSearchTerm] = useState(''); // 🔍 Search state

  // const fetchData = () => {
  //   fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log('Fetched data:', data);
  //       setData(data);
  //     });
  // };

  // ✅ Fetch data based on pageLimit
  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${pageLimit}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      console.log('Fetched data:', jsonData);
      setData(jsonData);
      setOriginalData(jsonData); // keep original data for search
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // ✅ Fetch on mount and when pageLimit changes
  useEffect(() => {
    fetchData();
  }, [pageLimit]);

  // ✅ Handle page limit change
  const handlePageLimitChange = (e) => {
    setPageLimit(Number(e.target.value)); // important: convert to number
  };

  // ✅ Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = originalData.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.body.toLowerCase().includes(term)
    );
    setData(filtered);
  };

  return (
    <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-6'>
      <h2 className='text-center text-xl font-semibold mb-4'>DataTable</h2>

      <div className='flex flex-wrap justify-between items-center mb-4 gap-4'>
        {/* Shorting Dropdown (placeholder for now) */}
        <div>
          <label htmlFor='shorting' className='mr-2'>
            Sort by:
          </label>
          <select id='shorting' className='border rounded p-1'>
            <option value='id'>ID</option>
            <option value='title'>Title</option>
            <option value='body'>Body</option>
          </select>
        </div>

        {/* Search Input */}
        <div>
          <label htmlFor='search' className='mr-2'>
            Search:
          </label>
          <input
            type='text'
            id='search'
            className='border rounded p-1'
            placeholder='Search by title or body...'
            value={searchTerm}
            onChange={handleSearch}
          />
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
            <option value='10'>10</option>
            <option value='20'>20</option>
            <option value='50'>50</option>
          </select>
        </div>
      </div>

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
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td className='py-2 px-4 border'>{item.id}</td>
                <td className='py-2 px-4 border'>{item.title}</td>
                <td className='py-2 px-4 border'>{item.body}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='3' className='text-center py-4'>
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
