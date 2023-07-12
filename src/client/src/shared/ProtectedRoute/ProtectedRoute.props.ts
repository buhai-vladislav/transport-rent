import { ReactElement } from 'react';

interface IPrivateRouteProps {
  children?: ReactElement;
  redirectPath?: string;
  roles?: string[];
}

export type { IPrivateRouteProps };
