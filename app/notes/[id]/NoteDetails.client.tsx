'use client'

import { fetchNoteById } from '@/lib/api'
import css from './NoteDetails.module.css'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

const NoteDetailsPage = () => {
  const { id } = useParams<{ id: string }>()

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['notes', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  })
    
  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError || !note) {
    return <p>Something went wrong.</p>
  }
  return (
    note && (
      <>
        <main className={css.main}>	
	    <div className={css.container}>
		<div className={css.item}>
		  <div className={css.header}>
		    <h2>{note.title}</h2>
		  </div>
		  <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
		  <p className={css.date}>{note.createdAt}</p>
		</div>
	</div>
</main>
      </>
    )
  )
}

export default NoteDetailsPage
