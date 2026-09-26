export interface CreateItemRequestDto {
  url: string;
  category?: string;
  categoryName?: string;
  refItemsCategoryId?: number;
  itemsId?: number;
  itemsUuid?: string;
  title?: string | null;
  description?: string | null;
  content?: string | null;
  author?: string | null;
  coverImage?: string | null;
  isRead?: boolean;
  isArchived?: boolean;
  favorite?: boolean;
  markAsRead?: boolean;
  tags?: string[] | null;
}

export interface UpdateItemRequestDto {
  url?: string;
  category?: string;
  categoryName?: string;
  title?: string | null;
  description?: string | null;
  content?: string | null;
  author?: string | null;
  coverImage?: string | null;
  isRead?: boolean;
  isArchived?: boolean;
  favorite?: boolean;
  markAsRead?: boolean;
  tags?: string[] | null;
}

export interface UpdateItemStatusRequestDto {
  favorite?: boolean;
  markAsRead?: boolean;
}

export interface GetItemsQueryDto {
  isRead?: string;
  isArchived?: string;
  favorite?: string;
  markAsRead?: string;
  category?: string;
}

export interface ArchiveItemRequestDto {
  isArchived?: boolean;
}
