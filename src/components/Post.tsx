import { useEffect, useState } from 'react';
import { publicApi } from '../services/apis';

// ✅ Define the expected shape of a post
interface Post {
  id: number;
  title: string;
  body: string;
}

export default function PostComponent() {
  const [post, setPost] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await publicApi.get<Post[]>('/posts?_limit=10');
      setPost(response.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  if (loading) {
    return (
      <div className='max-w-md mx-auto bg-white rounded-lg shadow-lg p-6'>
        <div className='animate-pulse'>
          <div className='h-6 bg-gray-200 rounded mb-4'></div>
          <div className='h-4 bg-gray-200 rounded mb-2'></div>
          <div className='h-4 bg-gray-200 rounded mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-3/4'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6'>
        <h3 className='text-red-800 font-semibold mb-2'>Error loading post</h3>
        <p className='text-red-600'>{error}</p>
        <button
          onClick={fetchPost}
          className='mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200'
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-8'>
      {post.map((item) => (
        <div key={item.id} className='mb-6'>
          <h2 className='text-2xl font-bold text-gray-800 mb-2'>
            {item.title}
          </h2>
          <p className='text-gray-600'>{item.body}</p>
        </div>
      ))}
    </div>
  );
}
