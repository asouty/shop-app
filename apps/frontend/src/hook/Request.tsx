import axios from "axios";
import { getToken } from "./Authentication.tsx";

export async function getAuthRequest<T>(url: string): Promise<T> {
  return getAuthRequestP<T>(url, {});
}
export async function getAuthRequestP<T>(
  url: string,
  params: unknown,
): Promise<T> {
  try {
    return (
      await axios.get(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
        params,
      })
    ).data;
  } catch (reason) {
    console.log(reason);
    throw reason;
  }
}
export async function postAuthRequest<T>(url: string, data: T): Promise<T> {
  try {
    return (
      await axios.post(url, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
    ).data;
  } catch (reason) {
    console.log(reason);
    throw reason;
  }
}

export async function putAuthRequest<T>(url: string, data: T): Promise<T> {
  try {
    return (
      await axios.put(url, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
    ).data;
  } catch (reason) {
    console.log(reason);
    throw reason;
  }
}
export async function patchAuthRequest<T>(url: string, data: T): Promise<T> {
  try {
    return (
      await axios.patch(url, data, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
    ).data;
  } catch (reason) {
    console.log(reason);
    throw reason;
  }
}
