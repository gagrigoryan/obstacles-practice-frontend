export enum RequestMethodType {
  POST = "POST",
  GET = "GET",
}

type TRequest = {
  path: string;
  method: RequestMethodType;
  body?: any;
};

export const API_URL = "https://p.a6raywa1cher.com";

export const COMMON_FETCH_OPTIONS = {
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
};

export const apiRequest = async ({ path, method, body }: TRequest) => {
  const response = await fetch(`${API_URL}/${path}`, {
    ...COMMON_FETCH_OPTIONS,
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;

  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  return data;
};
