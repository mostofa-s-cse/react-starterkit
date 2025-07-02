import Counter from './components/Counter';
import Layout from './components/Layout';

const App = () => {
  return (
    <Layout>
      <div className='min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200'>
        <div className='container mx-auto px-4 py-8'>
          <header className='text-center mb-8'>
            <h1 className='text-4xl font-bold text-gray-800 mb-2'>
              React Starter Kit
            </h1>
            <p className='text-gray-600'>
              Built with Redux Toolkit, Tailwind CSS, and modern tooling
            </p>
          </header>
          <Counter />
        </div>
      </div>
    </Layout>
  );
};

export default App;
