import { styled } from '@nextui-org/react';

export const StepWrapper = styled('div', {
  dflex: 'center',
  flexDirection: 'column',
  gap: '20px',
  '.steps': {
    display: 'flex',
    gap: '5px',
    button: {
      width: '15px',
      height: '15px',
      border: 'none',
      borderRadius: '50%',
    },
    '.active': {
      backgroundColor: '$primary',
    },
  },
});
