// src/common/interfaces/cloudinary-response.interface.ts
export interface CloudinaryResponse {
  url: string;
  public_id: string;
  [key: string]: any;
}
