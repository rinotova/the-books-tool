import { BooksData } from '@/types';
import { useQuery } from '@tanstack/react-query';

const BASE_URL = 'https://gutendex.com/books/';

export const fetchBooks = async (
  pageNumber: number,
  debouncedsearchTerm?: string
): Promise<BooksData> => {
  const response = !debouncedsearchTerm
    ? await fetch(`${BASE_URL}?page=${pageNumber}`)
    : await fetch(
        `${BASE_URL}?search=${encodeURIComponent(debouncedsearchTerm)}`
      );
  const responseJson = await response.json();
  return responseJson;
};

export const useGetBooks = (
  pageNumber: number,
  debouncedsearchTerm?: string
) => {
  return useQuery({
    queryKey: ['booksQuery', debouncedsearchTerm || pageNumber],
    queryFn: () => fetchBooks(pageNumber, debouncedsearchTerm),
    keepPreviousData: true,
    staleTime: Infinity,
  });
};
