import BooksTable from '@/components/BooksTable/BooksTable';
import { columns } from '@/components/BooksTable/columns';
import { fetchBooks, useGetBooks } from '@/hooks/useGetBooks';
import { Inter } from 'next/font/google';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { queryClient } from './_app';
import { LoadingSpinner } from '@/components/Spinner';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedsearchTerm, setDebouncedsearchTerm] = useState('');

  const { data, isPreviousData, isFetching } = useGetBooks(
    page,
    debouncedsearchTerm
  );
  const books = data?.results;

  function onSearchHandler(searchTerm: string) {
    setSearchTerm(searchTerm);
  }

  useEffect(() => {
    let delayInputTimeoutId = setTimeout(() => {
      setDebouncedsearchTerm(searchTerm);
    }, 400);

    return () => clearTimeout(delayInputTimeoutId);
  }, [searchTerm]);

  if (!data && isFetching) {
    return (
      <div className='flex min-h-screen max-w-screen flex-col items-center p-4 font-mono'>
        <h1 className='text-green-500 text-2xl md:text-5xl tracking-widest mb-6 underline underline-offset-8'>
          The Books Tool
        </h1>

        <div className='flex gap-2 items-center justify-center'>
          <LoadingSpinner size={30} />
          <p>Loading books, please wait...</p>
        </div>
      </div>
    );
  }

  if (data?.next && !debouncedsearchTerm) {
    void queryClient.prefetchQuery({
      queryKey: ['booksQuery', page + 1],
      queryFn: () => fetchBooks(page + 1),
      staleTime: Infinity,
    });
  }

  return (
    <main
      className={`flex min-h-screen max-w-screen flex-col items-center justify-between p-4 ${inter.className}`}
    >
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm flex flex-col'>
        <h1 className='text-green-500 text-2xl md:text-5xl tracking-widest mb-6 underline underline-offset-8'>
          The Books Tool
        </h1>
        {books && books.length > 0 ? (
          <>
            <div className='w-full mb-2 flex gap-2 items-center'>
              <Button
                variant='secondary'
                onClick={() => setPage((old) => Math.max(old - 1, 0))}
                disabled={!!debouncedsearchTerm || page === 1}
              >
                Previous
              </Button>

              <Button
                variant='secondary'
                onClick={() => {
                  if (!isPreviousData && data?.next) {
                    setPage((old) => old + 1);
                  }
                }}
                // Disable the Next Page button until we know a next page is available
                disabled={
                  !!debouncedsearchTerm || isPreviousData || !data?.next
                }
              >
                Next
              </Button>
              {isFetching && isPreviousData ? (
                <div className='flex gap-2 items-center justify-center'>
                  <LoadingSpinner size={30} />
                  <p>Loading books, please wait...</p>
                </div>
              ) : null}
            </div>

            <BooksTable
              columns={columns}
              data={books}
              searchTerm={searchTerm}
              onSearch={onSearchHandler}
            />
          </>
        ) : null}
      </div>
    </main>
  );
}
