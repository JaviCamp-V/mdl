const textFieldStyles = {
  '& .MuiInputBase-root': {
    backgroundColor: 'info.main',
    color: 'info.contrastText',
    fontSize: '14px',
    height: '40px'
  },
  '& input': {
    '&:-webkit-autofill': {
      WebkitBoxShadow: `0 0 0 1000px info.main inset`,
      WebkitTextFillColor: 'info.contrastText'
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '14px',
    color: 'info.contrastText'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  },
  '&.Mui-focused': {
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
  },
  '& .MuiSelect-icon': {
    color: 'info.contrastText'
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'background.paper'
    },
    '&:hover fieldset': {
      borderColor: 'background.paper'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'background.paper'
    }
  },
  fontSize: '14px'
};

export { textFieldStyles };
