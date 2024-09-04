import React from 'react';
import { capitalCase } from 'change-case';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NotFound from '@/components/common/NotFound';
import TabsList from '@/components/common/Tablist';
import routes from '@/libs/routes';
import ProfileCard from '../../components/card/profile';
import PersonDetails from '../../components/card/profileMetaDetails';
import { getUserProfile } from '../../service/userProfileService';

interface UserProfileContainerProps {
  username: string;
  sections?: string[];
  searchParams: { [key: string]: string };
}

const UserProfileContainer: React.FC<UserProfileContainerProps> = async ({ username, sections, searchParams }) => {
  const tab = sections ? sections[0] : '';
  const { comments } = searchParams ?? {};
  const tabs = [
    { label: 'Profile', href: '', sx: { display: 'flex' } },
    { label: 'Reviews', href: 'reviews' },
    { label: 'Recommendations', href: 'recommendations' },
    { label: 'Lists', href: 'lists' },
    { label: 'Stats', href: 'Stats' },
    { label: 'Watchlist', href: routes.user.watchlist.replace('{username}', username) }
  ];

  if (tab !== '' && !tabs.find((link) => link.href === tab)) return <NotFound type="profile" />;

  const profileData = await getUserProfile(username);
  if (!profileData) return <NotFound type={'profile'} />;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row-reverse' },
        gap: 2,
        width: '100%',
        margin: 0,
        minHeight: '40vh'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: { xs: '100%', md: '75%' },
          backgroundColor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          paddingY: 2
        }}
      >
        <Typography fontSize={24} fontWeight={700} paddingLeft={2}>
          {capitalCase(profileData.displayName)}
        </Typography>
        <TabsList tabs={tabs} activeTab={tab} baseUrl={`profile/${username}`} />
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 2, width: '25%' }}>
        <ProfileCard username={username} displayName={profileData.displayName} avatarUrl={profileData.avatarUrl} />
        <PersonDetails
          lastOnlineAt={profileData.lastOnlineAt}
          joinedAt={profileData.joinedAt}
          birthday={profileData.birthday}
          location={profileData.location}
        />
      </Box>
    </Box>
  );
};

export default UserProfileContainer;
