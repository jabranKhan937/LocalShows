export interface ImageListType {
  id?: string;
  file_url: string;
  file_name: string;
  isSelected?: boolean;
}

export interface Image {
  mime: string;
  data: string;
  width: number;
  height: number;
  sourceURL: string;
}

export interface SelectedImage {
  uri: string;
}
