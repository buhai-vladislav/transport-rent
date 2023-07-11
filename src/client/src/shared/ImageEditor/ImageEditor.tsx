import AvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import { ImageEditorWrapper } from './ImageEditor.presets';
//@ts-ignore
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { FC, useCallback, useState } from 'react';
import type { IImageEditorProps } from './ImageEditor.props';
import { Button, Image } from '@nextui-org/react';

export const ImageEditor: FC<IImageEditorProps> = ({
  image,
  setImage,
  height = 250,
  width = 250,
  imageRef,
  buttons,
  borderRadius = 140,
  disabled,
}) => {
  const [scale, setScale] = useState(1);

  const handleDrop = useCallback((dropped: File[]) => {
    setImage(dropped[0]);
  }, []);

  const resetImage = useCallback(() => {
    setImage('');
  }, []);

  return disabled ? (
    <Image
      src={typeof image === 'string' ? image : ''}
      width="650px"
      css={{ borderRadius: '25px' }}
    />
  ) : (
    <ImageEditorWrapper>
      <Dropzone onDrop={handleDrop} noClick={!!image} noKeyboard>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <AvatarEditor
              ref={imageRef}
              width={width}
              height={height}
              image={image}
              borderRadius={borderRadius}
              scale={scale}
            />
            <input {...getInputProps()} />

            <Button size="xs" color="gradient" onClick={resetImage}>
              Reset
            </Button>
          </div>
        )}
      </Dropzone>
      <RangeSlider
        className="single-thumb"
        defaultValue={[1, 1]}
        min={1}
        max={4}
        step={0.01}
        thumbsDisabled={[true, false]}
        rangeSlideDisabled={true}
        onInput={(values: any) => setScale(values[1])}
      />
      {buttons}
    </ImageEditorWrapper>
  );
};
