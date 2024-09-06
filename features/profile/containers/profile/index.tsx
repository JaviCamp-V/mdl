import React from 'react';
import WatchlistOverview from '@/features/watchlist/components/ui/WatchlistOverview';
import { capitalCase } from 'change-case';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NotFound from '@/components/common/NotFound';
import TabsList from '@/components/common/Tablist';
import routes from '@/libs/routes';
import ProfileCard from '../../components/card/profile';
import PersonDetails from '../../components/card/profileMetaDetails';
import ProfileBio from '../../components/typography/Bio';
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

  const TabPanel = {
    reviews: <React.Fragment>Reviews</React.Fragment>,
    recommendations: <React.Fragment>Recommendations</React.Fragment>,
    lists: <React.Fragment>Lists</React.Fragment>,
    stats: <React.Fragment>Stats</React.Fragment>
  }[tab] || <ProfileBio bio={profileData.bio} />;

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
          width: { xs: '100%', md: '75%' }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
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
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 0,
              paddingY: 2
            }}
          >
            {TabPanel}
          </Box>
        </Box>

        {!tab && (
          <WatchlistOverview
            username={username}
            containerStyle={{
              backgroundColor: 'background.paper',
              borderRadius: 2
              // border: '1px solid hsla(210,8%,51%,.13)'
            }}
          />
        )}
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