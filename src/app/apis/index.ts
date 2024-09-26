/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const getListBlog = async () => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Blog`);
    return res.data;
  } catch (error) {
    console.error("Error fetching blog list:", error);
    throw error;
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createBlog = async (data: any) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/Blog`,
      data
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching blog list:", error);
    throw error;
  }
};

export const deleteBlog = async (id: string) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/Blog/${id}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching blog list:", error);
    throw error;
  }
};
export const editBlog = async (data: any, id: string) => {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/Blog/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching blog list:", error);
    throw error;
  }
};
export const detailBlog = async (id: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/Blog/${id}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching blog list:", error);
    throw error;
  }
};

export const addComment = async (data: any, id: string) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/Blog/${id}/comments`,
      data
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching blog list:", error);
    throw error;
  }
};
