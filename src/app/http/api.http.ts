import { base_backend } from "@/context/environment";
import axios from "axios";

export async function get(module: string, session: any) {
  return await axios.get(`${base_backend}/api/${module}`, {
    headers: {
      session: JSON.stringify(session),
    },
  });
}

export async function getId(module: string, id: number, session: any) {
  return await axios.get(`${base_backend}/api/${module}/${id}`, {
    headers: {
      session: JSON.stringify(session),
    },
  });
}

export async function getByDNI(module: string, dni: string, session: any) {
  return await axios.get(`${base_backend}/api/${module}/${dni}`, {
    headers: {
      session: JSON.stringify(session),
    },
  });
}

export async function post(module: string, data: any, session: any) {
  return await axios.post(`${base_backend}/api/${module}`, data, {
    headers: {
      session: JSON.stringify(session),
    },
  });
}

export async function postExcel(module: string, data: any, session: any) {
  return await axios.post(`${base_backend}/api/${module}`, data, {
    headers: {
      session: JSON.stringify(session),
      responseType: "blob",
    },
  });
}

export async function postImage(module: string, data: any, session: any) {
  return await axios.post(`${base_backend}/api/${module}`, data, {
    headers: {
      session: JSON.stringify(session),
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function putId(
  module: string,
  data: any,
  id: number,
  session: any
) {
  return await axios.put(`${base_backend}/api/${module}/${id}`, data, {
    headers: {
      session: JSON.stringify(session),
    },
  });
}

export async function deleteId(module: string, id: number, session: any) {
  return await axios.delete(`${base_backend}/api/${module}/${id}`, {
    headers: {
      session: JSON.stringify(session),
    },
  });
}
