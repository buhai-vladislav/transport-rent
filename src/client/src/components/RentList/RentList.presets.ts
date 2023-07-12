import { styled } from '@nextui-org/react';

export const RentListWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  width: '70vw',
  '.info-block': {
    display: 'grid',
    gridTemplateColumns: '1fr',
    justifyContent: 'space-between',
  },
});
