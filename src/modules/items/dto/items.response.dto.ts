import { Item } from "../../../models/read-it-later-schema.js";

export interface ItemResponseDto extends Item {
  url?: string | null;
  category?: string | null;
}

export interface ItemArchiveResponseDto {
  itemsId: number;
  isArchived: boolean;
}

export interface ItemStatusResponseDto {
  itemsId: number;
  favorite: boolean;
  markAsRead: boolean;
}
