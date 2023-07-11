import { Dropdown } from '@nextui-org/react';
import { ISelectProps } from './Select.props';
import { FC } from 'react';
import { SelectWrapper } from './Select.presets';

export const Select: FC<ISelectProps> = ({
  value,
  type,
  setValue,
  title,
  disabled,
}) => {
  const format = (value: Set<string> | undefined) => {
    const str = Array.from(value ?? [])
      .join('')
      .toString()
      .toLowerCase();
    if (str.includes('#')) {
      return str.split('#')[1];
    }
    return str;
  };
  return (
    <SelectWrapper>
      <span>{title}</span>
      <Dropdown>
        <Dropdown.Button
          flat
          color="primary"
          css={{ tt: 'capitalize', width: '100%' }}
          disabled={disabled}
        >
          {format(value)}
        </Dropdown.Button>
        <Dropdown.Menu
          aria-label="Single selection actions"
          color="primary"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={value}
          // @ts-ignore
          onSelectionChange={setValue}
        >
          {Object.entries(type).map(([key, item]) => (
            <Dropdown.Item key={`${key}#${item}`} css={{ tt: 'capitalize' }}>
              {item.toLowerCase()}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </SelectWrapper>
  );
};
