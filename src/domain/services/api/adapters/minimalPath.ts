import { apiRequest, RequestMethodType } from "../apiRequest";
import { TMinimalPathRequest, TMinimalPathResponse } from "../../../entities/path";

export const fetchMinimalPath = (body: TMinimalPathRequest): Promise<TMinimalPathResponse> =>
  apiRequest({
    path: "sp/calc",
    method: RequestMethodType.POST,
    body,
  });
