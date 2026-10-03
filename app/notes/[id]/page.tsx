import { fetchNoteById } from '@/lib/api'
import NoteDetailsPage from './NoteDetails.client'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

interface NoteDetailsProps {
  params: Promise<{ id: string }>
}
const NoteDetails = async ({ params }: NoteDetailsProps) => { 
    
  const { id } = await params
  const queryClient = new QueryClient()
   await queryClient.query({
    queryKey: ['notes', id],
    queryFn: () => fetchNoteById(id),
  })

  return (
    
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsPage />
      </HydrationBoundary>
  
  )
}

export default NoteDetails