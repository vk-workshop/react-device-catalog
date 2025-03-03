export interface ChatMessage {
  role: string;
  message: string;
}

export interface PaginationProps {
  total: number;
  perPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}
