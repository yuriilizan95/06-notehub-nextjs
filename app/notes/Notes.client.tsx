'use client';

import { useState } from 'react';
import Modal from '../../components/Modal/Modal';
import NoteForm from '../../components/NoteForm/NoteForm';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import css from './Notepage.module.css'; 
import NoteList from '../../components/NoteList/NoteList';
import { fetchNotes } from '../../lib/api';
import type { FetchNotesResponse } from '../../lib/api';
import Pagination from '../../components/Pagination/Pagination';
import { useDebounce } from 'use-debounce';
import SearchBox from '../../components/SearchBox/SearchBox';

export default function NotesClient() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateNote, setIsCreateNote] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);

  const {
    data,
    isError,
  } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', { page, search: debouncedSearch }],
    queryFn: () => fetchNotes({ page, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onSearch={(newSearch) => {
            setSearch(newSearch);
            setPage(1);
          }}
        />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            page={page}
            onPageChange={setPage}
          />
        )}
        <button
          onClick={() => {
            setIsModalOpen(true);
            setIsCreateNote(true);
          }}
          className={css.button}
        >
          Create note +
        </button>
      </header>


      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          {isCreateNote && <NoteForm onCancel={() => setIsModalOpen(false)} />}
        </Modal>
      )}
      {!isError && data?.notes && <NoteList notes={data.notes} />}
    </div>
  );
}