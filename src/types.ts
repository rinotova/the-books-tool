export interface Book {
  id: string;
  title: string;
  authors: BookAuthor[];
  subjects: BookSubject[];
  formats: BookFormats;
}

export interface BookAuthor {
  name: string;
}

export interface BookSubject {
  subject: string;
}

export interface BookFormats {
  'image/jpeg': string;
  'text/html; charset=utf-8': string;
  'application/epub+zip': string;
}

export interface BooksData {
  results: Book[];
  next: string | null;
}
