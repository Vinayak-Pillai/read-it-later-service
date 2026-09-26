import { Response } from "express";

export type ResponseData = object;

export interface ApiResponsePayload<T extends ResponseData = ResponseData> {
  status: number;
  message: string;
  data: T;
}

/**
 * Handles HTTP responses with mandatory status, message, and data (object or array).
 */
export const handleResponse = <T extends ResponseData>(
  res: Response,
  responseObj: ApiResponsePayload<T>
): Response => {
  return res.status(responseObj.status).json({
    status: responseObj.status,
    message: responseObj.message,
    data: responseObj.data,
  });
};

export const sendResponse = handleResponse;
