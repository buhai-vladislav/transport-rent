import { styled } from '@nextui-org/react';

export const TransportFormWrapper = styled('form', {
  '.top-block': {
    display: 'flex',
    gap: '20px',
    flexDirection: 'row',
    marginBottom: '40px',
    '& > div:nth-child(1)': {
      borderRadius: '25px',
      boxShadow: '$lg',
      minWidth: '350px',
      padding: '20px',
      dflex: 'center',
    },
  },
  '.bg-paper': {
    borderRadius: '25px',
    boxShadow: '$lg',
    minWidth: '350px',
    padding: '20px',
  },
  '.title-info': {
    display: 'grid',
    gap: '20px',
    button: {
      //position: 'absolute',
    },
  },
  '.inputs-block': {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: '1fr 1fr',
  },
  '.color-block': {
    display: 'flex',
    gap: '6px',
    flexDirection: 'column-reverse',
    label: {
      fontSize: '0.875rem',
      color: '$primary',
      paddingLeft: '6px',
    },
  },
  'div[role=presentation]': {
    button: {
      width: '100%',
    },
  },
});
