import axios from "axios";

export async function get(module: string, session: any) {
  return await axios.get(`/api/${module}`, {
    headers: {
      session: JSON.stringify(session),
    },
  });
}

export async function getId(module: string, id: number, session: any) {
  return await axios.get(`/api/${module}/${id}`, {
    headers: {
      session: JSON.stringify(session),
    },
  });
}

export async function post(module: string, data: any, session: any) {
  return await axios.post(`/api/${module}`, data, {
    headers: {
      session: JSON.stringify(session),
    },
  });
}

export async function postImage(module: string, data: any, session: any) {
  return await axios.post(`/api/${module}`, data, {
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
  return await axios.put(`/api/${module}/${id}`, data, {
    headers: {
      session: JSON.stringify(session),
    },
  });
}

export async function deleteId(module: string, id: number, session: any) {
  return await axios.delete(`/api/${module}/${id}`, {
    headers: {
      session: JSON.stringify(session),
    },
  });
}
