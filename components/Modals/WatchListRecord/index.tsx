import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { enqueueSnackbar } from 'notistack';
import { SubmitHandler, useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton
} from '@mui/material';
import { deleteWatchlistRecord, updateWatchlistRecord } from '@/server/watchlistActions';
import {
  FormType,
  advancedModel,
  defaultValues,
  formSchema,
  generalModel
} from '@/components/Forms/AddWatchItem/model';
import DramaPoster from '@/components/Poster';
import RHFForm from '@/components/RHFElements/RHFForm';
import SlideTransition from '@/components/common/SlideTransition';
import { FieldModel } from '@/types/common/IForm';
import MediaType from '@/types/tmdb/IMediaType';
import MovieDetails from '@/types/tmdb/IMovieDetails';
import TVDetails from '@/types/tmdb/ITVDetails';
import UpdateWatchlistRequest from '@/types/watchlist/IUpdateWatchlistRequest';
import WatchlistRecord from '@/types/watchlist/IWatchlistRecord';
import WatchStatus from '@/types/watchlist/WatchStatus';
import { formatDate, formatStringDate } from '@/utils/formatters';
import { getTitle, getYear, hasRelease } from '@/utils/tmdbUtils';
import WatchRecordHistoryList from './history';

interface WatchlistRecordProps {
  open: boolean;
  onClose: () => void;
  mediaType: MediaType;
  id: number;
  mediaData: TVDetails | MovieDetails;
  record: WatchlistRecord | null;
}

const WatchlistRecordModal: React.FC<WatchlistRecordProps> = ({ open, onClose, mediaData, id, mediaType, record }) => {

  const [view, setView] = React.useState<'General' | 'Advanced' | 'History'>('General');
  const buttons = ['General', 'Advanced', 'History'].filter((button) => record || button !== 'History');

  const isReleased = hasRelease(mediaData, mediaType);

  const formFields = React.useMemo(() => {
    if (view === 'History') return {};
    generalModel.watchStatus.options = generalModel.watchStatus.options?.map((option) => {
      let disabled = option.value !== WatchStatus.PLAN_TO_WATCH && !isReleased;
      if (!disabled && option.value === WatchStatus.COMPLETED && mediaType === MediaType.tv) {
        disabled = (mediaData as TVDetails).last_episode_to_air?.episode_type !== 'finale';
      }
      return { ...option, disabled };
    });
    generalModel.episodeWatched.disabled = !isReleased || mediaType === MediaType.movie;
    generalModel.episodeWatched.max = mediaType === MediaType.tv ? (mediaData as TVDetails).number_of_episodes : 0;
    generalModel.rating.disabled = !isReleased;
    advancedModel.startDate.disabled = !isReleased;
    advancedModel.endDate.disabled = !isReleased;
    advancedModel.rewatchValue.disabled = !isReleased;
    advancedModel.rewatchCount.disabled = !isReleased;

    return view === 'General' ? generalModel : advancedModel;
  }, [view]);

  const newDefaultValues = React.useMemo(() => {
    if (!record) return { ...defaultValues, watchStatus: WatchStatus.PLAN_TO_WATCH, startDate: new Date() };
    return {
      watchStatus: record.watchStatus ?? WatchStatus.PLAN_TO_WATCH,
      episodeWatched: record.episodeWatched ?? defaultValues.episodeWatched,
      rating: record.rating ?? defaultValues.rating,
      notes: record.notes ?? defaultValues.notes,
      priority: record.priority ?? defaultValues.priority,
      rewatchValue: record.rewatchValue ?? defaultValues.rewatchValue,
      rewatchCount: record.rewatchCount ?? defaultValues.rewatchCount,
      startDate: record.startDate ? formatStringDate(record.startDate) : defaultValues.startDate,
      endDate: record.endDate ? formatStringDate(record.endDate) : defaultValues.endDate
    };
  }, [record]);

  const updatedSchema = React.useMemo(() => {
    return formSchema.test('validEpisodeWatched', '', (value, context) => {
      if (!value?.episodeWatched) return true;
      const totalEpisodes = mediaType === MediaType.tv ? (mediaData as TVDetails).number_of_episodes : 0;
      if (value.episodeWatched <= totalEpisodes) return true;
      return context.createError({
        message: 'Episodes watched cannot be more than released episodes',
        path: 'episodeWatched'
      });
    });
  }, [mediaData]);

  const methods = useForm<FormType>({
    mode: 'onChange',
    resolver: yupResolver(updatedSchema),
    defaultValues: newDefaultValues,
    shouldFocusError: true,
    criteriaMode: 'all'
  });

  const onSubmit: SubmitHandler<FormType> = async (formData) => {
    const { startDate, endDate } = formData;
    const request: UpdateWatchlistRequest = {
      ...formData,
      mediaType: mediaType.toUpperCase() as MediaType,
      mediaId: id,
      startDate: startDate ? formatDate(startDate) : null,
      endDate: endDate ? formatDate(endDate) : null
    };
    const response = await updateWatchlistRecord(request);
    if (response && 'errors' in response) {
      response.errors.forEach((error) => {
        methods.setError(error.field as keyof FormType, { type: 'manual', message: error.message });
      });
      enqueueSnackbar('An error occurred while updating the record', { variant: 'error' });
      return;
    }
    onClose();
    enqueueSnackbar(response.message, { variant: 'success' });
  };

  const onDelete = async () => {
    if (!record) return;
    const response = await deleteWatchlistRecord(record?.id);
    if (response && 'errors' in response) {
      enqueueSnackbar('An error occurred while deleting the record', { variant: 'error' });
      return;
    }
    enqueueSnackbar(response.message, { variant: 'success' });
    onClose();
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={SlideTransition}
      onClose={onClose}
      maxWidth="sm"
      scroll="body"
      fullWidth={true}
      sx={{}}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingTop: 2 }}
      >
        <DialogTitle
          fontSize={18}
          padding={'0!important'}
          marginLeft={2}
        >{`${getTitle(mediaData as any)} (${getYear(mediaData as any)})`}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'inherit',
            marginRight: 2
          }}
        >
          <CloseIcon sx={{ width: 20, height: 20 }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ width: '100%', height: '100%', paddingX: 2 }}>
        <Grid container spacing={2} sx={{ width: '100%', height: '100%' }}>
          <Grid item xs={12} md={4.5}>
            <Box sx={{ backgroundColor: 'background.default', padding: 2, height: { xs: 'max-content', md: '55vh' } }}>
              <Box sx={{ width: '100%', height: '30vh', display: { xs: 'none', md: 'block' } }}>
                <DramaPoster src={mediaData.poster_path} id={id} mediaType={mediaType} size="w300" />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                {buttons.map((button) => (
                  <Button
                    key={button}
                    variant={view === button ? 'contained' : 'text'}
                    color={view === button ? 'primary' : 'inherit'}
                    onClick={() => setView(button as 'General' | 'Advanced' | 'History')}
                    sx={{
                      width: '100%',
                      textTransform: 'capitalize',
                      margin: 0,
                      height: 30,
                      fontSize: 14,
                      justifyContent: { xs: 'left', md: 'center' }
                    }}
                  >
                    {button}
                  </Button>
                ))}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={7.5}>
            <Box sx={{ paddingX: 2 }}>
              {record && view === 'History' ? (
                <WatchRecordHistoryList history={record?.history} />
              ) : (
                <RHFForm fields={formFields} methods={methods} />
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          paddingBottom: 2,
          paddingX: 2,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          gap: 1
        }}
      >
        {record && (
          <Button
            onClick={onDelete}
            variant="contained"
            sx={{
              textTransform: 'capitalize',
              backgroundColor: '#f78989',
              color: '#fff',
              borderColor: '#f78989',
              fontWeight: 700,
              justifySelf: 'flex-start',
              '&:hover': {
                backgroundColor: '#f56c6c',
                color: '#fff',
                borderColor: '#f56c6c'
              }
            }}
          >
            Delete
          </Button>
        )}

        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
          <Button onClick={onClose} variant="contained" color="info" sx={{ textTransform: 'capitalize' }}>
            Cancel
          </Button>
          <LoadingButton
            disabled={false}
            loading={methods.formState.isSubmitting}
            onClick={methods.handleSubmit(onSubmit)}
            variant="contained"
            sx={{ textTransform: 'capitalize' }}
          >
            Submit
          </LoadingButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default WatchlistRecordModal;