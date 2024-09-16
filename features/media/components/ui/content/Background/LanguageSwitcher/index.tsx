'use client';

import React from 'react';
import { Translation } from '@/features/media/types/interfaces/Translation';
import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Iconify from '@/components/Icon/Iconify';
import { color } from '@/libs/common';

interface TranslationSwitcherProps {
  translations: Translation[];
}

const TranslationSwitcher: React.FC<TranslationSwitcherProps> = ({ translations }) => {
  const [currentTranslation, setCurrentTranslation] = React.useState<Translation>(
    translations.find((translation) => translation?.iso_639_1 === 'en') || translations[0]
  );
  const [showAll, setShowAll] = React.useState(false);
  return (
    <Box sx={{ marginBottom: 1 }}>
      <Box>
        <Typography fontSize={14} whiteSpace="pre-wrap" lineHeight={1.5} sx={{ WebkitFontSmoothing: 'antialiased' }}>
          {currentTranslation?.data?.overview}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 1,
          marginTop: 1
        }}
      >
        {translations.slice(0, showAll ? translations.length - 1 : 3).map((translation) => (
          <Button
            key={translation.iso_639_1}
            variant="contained"
            color="info"
            disabled={translation?.iso_639_1 === currentTranslation?.iso_639_1}
            onClick={() => setCurrentTranslation(translation)}
            sx={{
              padding: 0.5,
              textTransform: 'capitalize'
            }}
          >
            {translation.name}
          </Button>
        ))}
        {translations.length > 3 && (
          <Button
            variant="contained"
            color="info"
            onClick={() => setShowAll(!showAll)}
            sx={{
              textTransform: 'capitalize',
              padding: 0.5
            }}
          >
            <Iconify
              icon={showAll ? 'mdi:arrow-collapse' : 'mdi:dots-horizontal'}
              color={'inherit'}
              width={20}
              height={20}
            />
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TranslationSwitcher;
