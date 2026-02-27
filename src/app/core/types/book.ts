export interface Book {
  _id: string;
  author_id: string;
  categories: string[];
  book_title: string;
  book_cover_url?: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  score?: number;
}

export interface BooksPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// this is what we receive from the backend
export interface BooksListResponse {
  data: Book[];
  pagination: BooksPagination;
}

//optional filters we can send to the backend
//ex:/books /books?search=mohamed /books?page=2 /books?search=mohamed&page=2&limit=10
export interface BooksQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price' | 'createdAt';
  order?: 'asc' | 'desc';
}

