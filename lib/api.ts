import axios, { type AxiosResponse } from 'axios';
import type { 
  Note, 
  FormNotePayload 
} from '../types/note';

const NOTEHUB_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN

 interface FetchNotesParams {
  page?: number;
  search?: string;
  perPage?: number;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const apiClient = axios.create({
    baseURL: 'https://notehub-public.goit.study/api',
    headers: {
        Authorization: `Bearer ${NOTEHUB_TOKEN}`,
        accept: 'application/json',
    },
});

export const fetchNotes = async (
  params?: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await apiClient.get('/notes', {
    params: {
      page: params?.page ?? 1,
      search: params?.search || undefined,
      perPage: params?.perPage ?? 10,
    },
  });
  return response.data;
};

export const createNote = async (
  noteData: FormNotePayload
): Promise<Note> => {
  const response: AxiosResponse<Note> = await apiClient.post('/notes', noteData);
  return response.data;
};

export const deleteNote = async (
  id: string
): Promise<Note> => {
  const response: AxiosResponse<Note> = await apiClient.delete(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (
  id: string
): Promise<Note> => {
  const response: AxiosResponse<Note> = await apiClient.get(`/notes/${id}`);
  return response.data;
};