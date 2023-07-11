interface Enum {
  [key: string]: string;
}

interface ISelectProps {
  title: string;
  value?: Set<string>;
  type: Enum;
  setValue: (keys: Selection) => void;
  disabled?: boolean;
}

export type { ISelectProps };
