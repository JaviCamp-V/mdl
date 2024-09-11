import React from 'react';
import CommentsSection from '@/features/comments/components/ui/CommentsSection';
import CommentType from '@/features/comments/types/enums/CommentType';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import NotFound from '@/components/common/NotFound';
import MediaType from '@/types/enums/IMediaType';
import PersonMainDetails from '../../components/ui/person/MainDeatils';
import PersonDetailsSidePanel from '../../components/ui/person/SidePanel';
import { getPersonDetails } from '../../service/tmdbViewService';


interface PersonContainerProps {
  personId: number;
  searchParams?: { [key: string]: string };
}

const PersonContainer: React.FC<PersonContainerProps> = async ({ personId, searchParams }) => {
  const person = await getPersonDetails(personId);
  if (!person) return <NotFound type={MediaType.person} />;
  const { comments } = searchParams ?? {};

  return (
    <Grid container spacing={3} sx={{ padding: { xs: 0, md: 0 } }}>
      <Grid item xs={12} md={8.5}>
        <PersonMainDetails person={person} />
        <Box
          sx={{
            marginTop: 4,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <React.Suspense fallback={<LoadingSkeleton height="40vh" />}>
            <CommentsSection
              commentType={CommentType.PERSON}
              parentId={personId}
              page={comments ? Number(comments) : 1}
            />
          </React.Suspense>
        </Box>
      </Grid>
      <Grid item xs={12} md={3.5} sx={{ marginTop: 4, marginBottom: 4 }}>
        <PersonDetailsSidePanel
          personId={person.id}
          name={person.name}
          profile_path={person.profile_path}
          external_ids={person.external_ids}
          birthday={person.birthday}
          also_known_as={person.also_known_as}
          place_of_birth={person.place_of_birth}
          gender={person.gender}
        />
      </Grid>
    </Grid>
  );
};

export default PersonContainer;