import { Avatar, Button, Navbar, Popover, Text } from '@nextui-org/react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../icons';
import { useAppSelector } from '../../store/hooks/hooks';

export const Header = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);

  const logoutHandler = () => {
    navigate('/login');
  };

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
            <Link to="transports">
              <Text h5 css={{ marginBottom: '0' }}>
                Transports
              </Text>
            </Link>
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
                <Button size="sm" onPress={logoutHandler}>
                  Log out
                </Button>
              </Popover.Content>
            </Popover>
          </>
        )}
      </Navbar.Content>
    </Navbar>
  );
};
