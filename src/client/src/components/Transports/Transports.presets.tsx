import { styled } from '@nextui-org/react';

export const TransportsWrapper = styled('div', {
  display: 'flex',
  gap: '20px',
  flexDirection: 'row',
  '.search': {
    padding: '20px',
    width: '65vw',
  },
  '.cards': {
    display: 'flex',
    gap: '20px',
    flexDirection: 'column',
    alignItems: 'center',
  },
  '.filters': {
    padding: '20px',
    width: '300px',
    display: 'flex',
    gap: '20px',
    height: 'fit-content',
  },
});
