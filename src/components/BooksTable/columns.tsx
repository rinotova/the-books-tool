import { Book, BookAuthor, BookFormats, BookSubject } from '@/types';
import { ColumnDef, FilterFn, Row } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '../ui/badge';

let bookImage: React.JSX.Element | null;
let bookTitle: React.JSX.Element | null;

const getAuthors = (row: Row<Book>) => {
  const authorsObj = row.getValue('authors') as BookAuthor[];
  return authorsObj.map((authorData) => authorData.name).join(', ');
};

const getGenre = (row: Row<Book>) => {
  const subjectsObj = row.getValue('subjects') as string[];
  const genres = subjectsObj.map((subject) => (
    <Badge className='m-1' key={crypto.randomUUID()} variant='secondary'>
      {subject}
    </Badge>
  ));
  return <div>{genres}</div>;
};

const authorsFilter: FilterFn<any> = (row, columnId, value) => {
  const authors = getAuthors(row);
  return authors.includes(value);
};

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: 'formats',
    header: 'Cover',
    cell: ({ row }) => {
      const imageData = row.getValue('formats') as BookFormats;

      if (imageData['image/jpeg']) {
        bookImage =
          imageData['application/epub+zip'] ||
          imageData['text/html; charset=utf-8'] ? (
            <Link
              href={
                imageData['application/epub+zip'] ||
                imageData['text/html; charset=utf-8']
              }
            >
              <Image
                className='max-h-[120px] max-w-[80px]'
                alt='Book cover'
                src={imageData['image/jpeg']}
                width={150}
                height={250}
                priority={true}
              />
            </Link>
          ) : (
            <Image
              className='max-h-[120px] max-w-[80px]'
              alt='Book cover'
              src={imageData['image/jpeg']}
              width={150}
              height={250}
              priority={true}
            />
          );
      }

      return (
        <div className='flex justify-center items-center min-w-[80px] min-h-[120px]'>
          {bookImage ? bookImage : null}
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const bookFormats = row.getValue('formats') as BookFormats;
      const title = row.getValue('title') as string;
      bookTitle =
        bookFormats['application/epub+zip'] ||
        bookFormats['text/html; charset=utf-8'] ? (
          <Link
            href={
              bookFormats['application/epub+zip'] ||
              bookFormats['text/html; charset=utf-8']
            }
          >
            <span className='underline underline-offset-4'>{title}</span>
          </Link>
        ) : (
          <span>{title}</span>
        );
      return bookTitle ? bookTitle : null;
    },
  },
  {
    accessorKey: 'authors',
    header: 'Authors',
    cell: ({ row }) => {
      return <span>{getAuthors(row)}</span>;
    },
    filterFn: authorsFilter,
  },
  {
    accessorKey: 'subjects',
    header: 'Genre',
    cell: ({ row }) => {
      return <span>{getGenre(row)}</span>;
    },
  },
];
