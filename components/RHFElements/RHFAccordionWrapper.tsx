import React from 'react';
import { useFormContext } from 'react-hook-form';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { Field } from '@/types/common/IForm';
import RHFElementsSelector from '.';
import Iconify from '../Icon/Iconify';

interface RHFAccordionWrapperProps {
  field: Field;
}
const RHFAccordionWrapper: React.FC<RHFAccordionWrapperProps> = ({ field }) => {
  const { getValues } = useFormContext();
  const { label, ...rest } = field;
  const value = getValues(field.name);
  const [expanded, setExpanded] = React.useState<boolean>(Boolean(value));
  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{ boxShadow: 'none', borderBottom: '1px solid hsla(210, 8%, 51%, .13)' }}
      disableGutters
      square
    >
      <AccordionSummary expandIcon={<Iconify icon="gridicons:dropdown" width={25} color={'text.primary'} />}>
        <Typography>{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <RHFElementsSelector {...rest} />
      </AccordionDetails>
    </Accordion>
  );
};

export default RHFAccordionWrapper;
