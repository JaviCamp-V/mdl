import React from 'react';
import Grid from '@mui/material/Grid';
import NotFound from '@/components/common/NotFound';
import MediaType from '@/types/enums/IMediaType';
import PersonMainDetails from '../../components/ui/person/MainDeatils';
import PersonDetailsSidePanel from '../../components/ui/person/SidePanel';
import { getPersonDetails } from '../../service/tmdbService';

interface PersonContainerProps {
  personId: number;
}

const PersonContainer: React.FC<PersonContainerProps> = async ({ personId }) => {
  const person = await getPersonDetails(personId);
  if (!person) return <NotFound type={MediaType.person} />;

  return (
    <Grid container spacing={3} sx={{ padding: { xs: 0, md: 0 } }}>
      <Grid item xs={12} md={8.5}>
        <PersonMainDetails person={person} />
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
