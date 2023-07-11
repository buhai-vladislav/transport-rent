import { styled } from '@nextui-org/react';

export const ImageEditorWrapper = styled('div', {
  position: 'relative',
  dflex: 'center',
  flexDirection: 'column',
  gap: '20px',
  '.single-thumb .range-slider__thumb[data-lower]': {
    width: 0,
  },
});
