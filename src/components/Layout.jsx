const Layout = ({ children }) => {
  return (
    <div className='min-h-screen'>
      {children}
      <footer className='bg-gray-800 text-white py-4 mt-8'>
        <div className='container mx-auto px-4 text-center'>
          <p>&copy; 2025 React Starter Kit. Built with modern tools.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
