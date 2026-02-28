export interface Author {
  _id: string;
  name: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface AuthorsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AuthorsListResponse {
  data: Author[];
  pagination: AuthorsPagination;
}
