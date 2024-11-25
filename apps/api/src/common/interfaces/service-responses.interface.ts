// src/common/interfaces/service-responses.interface.ts
export interface ServiceResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface BatchOperationResponse {
  success: boolean;
  processed: number;
  failed: number;
  errors?: string[];
}
