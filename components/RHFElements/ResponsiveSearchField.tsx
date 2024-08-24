import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ClickAwayListener, IconButton, Paper, Popper } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchIcon from '../Icon/SearchIcon';
import SearchField from './SearchField';
import { TextFieldProps } from './TextField';

type ResponsiveSearchProps = TextFieldProps & {
  responsive?: boolean;
  onClick: () => void;
};

const ResponsiveSearchField: React.FC<ResponsiveSearchProps> = ({ responsive = true, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const { formState } = useFormContext();

  React.useEffect(() => {
    if (formState.submitCount) setAnchorEl(null);
  }, [formState.submitCount]);

  React.useEffect(() => {
    if (!isMobile) setAnchorEl(null);
  }, [isMobile]);

  const id = anchorEl ? 'responsive-search-field' : undefined;

  return (
    <Box sx={{ width: '100%' }}>
      {isMobile && responsive ? (
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <Box>
            <IconButton
              onClick={handleClick}
              id="search-field-toggle"
              aria-describedby={id}
              aria-controls={id}
              aria-haspopup="true"
            >
              <SearchIcon color="#fff" width={25} />
            </IconButton>

            <Popper id={id} open={Boolean(anchorEl)} anchorEl={anchorEl} disablePortal>
              <Paper
                sx={{
                  backgroundColor: 'background.paper',
                  boxShadow: '0 1px 1px rgba(0,0,0,.1)',
                  border: '1px solid rgba(0, 0, 0, .14)',
                  width: '100vw',
                  height: '12vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: (theme) => theme.zIndex.appBar + 10000
                }}
              >
                <Box
                  sx={{
                    width: '100vw',
                    padding: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <SearchField
                    {...props}
                    fieldColor="info.main"
                    borderColor={theme.palette.background.paper}
                    sx={{ width: '95vw!important', fontSize: 20 }}
                  />
                </Box>
              </Paper>
            </Popper>
          </Box>
        </ClickAwayListener>
      ) : (
        <SearchField
          {...props}
          fieldColor={responsive ? '#1a71a7' : 'background.paper'}
          borderColor={responsive ? '#337daa' : theme.palette.info.main}
        />
      )}
    </Box>
  );
};

export default ResponsiveSearchField;
