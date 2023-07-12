import {
  Avatar,
  Button,
  Loading,
  Navbar,
  Popover,
  Text,
} from '@nextui-org/react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../icons';
import { useAppSelector } from '../../store/hooks/hooks';
import { useLogoutMutation } from '../../store/api/main.api';
import { useCallback } from 'react';
import { IMutation } from '../../types/RTK';
import { IAffectedResult, IResponse } from '../../types/Response';
import { useErrorToast } from '../../hooks/useErrorToast';
import { HttpStatus } from '../../types/HttpStatus';

export const Header = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const [logout, { error, isLoading }] = useLogoutMutation();

  const logoutHandler = useCallback(async () => {
    const token = localStorage.getItem('refreshToken');

    if (token) {
      const response: IMutation<IResponse<IAffectedResult>> = await logout(
        token,
      );

      if (response.data?.data?.isAffected) {
        localStorage.clear();
        navigate('/signin');
      }
    }
  }, []);

  useErrorToast(
    error,
    [
      { status: HttpStatus.BAD_REQUEST },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    ],
    { position: 'bottom-center', type: 'error' },
  );

  return (
    <Navbar isBordered variant="sticky">
      <Navbar.Brand>
        <Logo />
        <Text b color="inherit" hideIn="xs">
          <Link to="/">TRent</Link>
        </Text>
      </Navbar.Brand>
      <Navbar.Content>
        {!user ? (
          <>
            <Button auto light>
              <Link to="login">Login</Link>
            </Button>
            <Button auto flat>
              <Link to="signup">Sign Up</Link>
            </Button>
          </>
        ) : (
          <>
            {user.role === 'USER' && (
              <Link to="rent-list">
                <Text h5 css={{ marginBottom: '0' }}>
                  Rent-List
                </Text>
              </Link>
            )}
            <Link to="transports">
              <Text h5 css={{ marginBottom: '0' }}>
                Transports
              </Text>
            </Link>
            {user.role === 'ADMIN' && (
              <Link to="transports/create">
                <Text h5 css={{ marginBottom: '0' }}>
                  Add new
                </Text>
              </Link>
            )}
            <Popover placement="left">
              <Popover.Trigger>
                <Avatar
                  text={user.name}
                  squared
                  bordered
                  src={user.image?.fileSrc}
                  css={{ cursor: 'pointer' }}
                />
              </Popover.Trigger>
              <Popover.Content>
                <Button size="sm" onPress={logoutHandler} disabled={isLoading}>
                  {isLoading ? <Loading size="sm" /> : 'Logout'}
                </Button>
              </Popover.Content>
            </Popover>
          </>
        )}
      </Navbar.Content>
    </Navbar>
  );
};
