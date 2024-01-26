// Demo.tsx
import React, { useEffect, useRef, useState } from 'react';

const BASE_URLS = [
  'https://arthurfrost.qflo.co.za/php/getTimeline.php',
  'https://arthurfrost.qflo.co.za/Images/',
  'https://arthurfrost.qflo.co.za/MP3/',
];

interface Post {
  id: number;
  title: string;
}

const Demo: React.FC = () => {
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchPosts = async (url: string) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);

      try {
        const response = await fetch(`${url}/posts?page=${page}`, {
          signal: abortControllerRef.current?.signal,
        });
        const posts = (await response.json()) as Post[];
        setPosts(posts);
      } catch (e: any) {
        if (e.name === 'AbortError') {
          console.log('Aborted');
          return;
        }

        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch data from each URL in the array
    BASE_URLS.forEach((url) => {
      fetchPosts(url);
    });
  }, [page]);

  if (error) {
    return <div>Something went wrong! Please try again.</div>;
  }

  return (
    <div className="tutorial">
      <h1 className="mb-4 text-2xl">Data Fetching in React</h1>
      <button onClick={() => setPage(page + 1)}>Increase Page ({page})</button>
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <ul>
          {posts.map((post) => {
            return <li key={post.id}>{post.title}</li>;
          })}
        </ul>
      )}
    </div>
  );
};

export default Demo;
