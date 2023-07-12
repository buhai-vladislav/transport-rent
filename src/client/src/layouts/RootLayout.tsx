import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Box } from '../shared/Box';
import { useAppDispatch } from '../store/hooks/hooks';
import { useLazyMeQuery, useMeQuery } from '../store/api/user.api';
import { useEffect } from 'react';
import { resetUser, setUser } from '../store/reducers/user';
export default function RootLayout() {
  const dispatch = useAppDispatch();
  const [getMe, { data, isError }] = useLazyMeQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.data) {
      dispatch(setUser(data.data));
      navigate('/');
    }
    if (isError) {
      dispatch(resetUser());
      navigate('/signin');
    }
  }, [data, isError]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      getMe();
    }
  }, []);

  return (
    <>
      <Header />
      <Box
        css={{
          height: 'calc(100vh - 76px)',
          dflex: 'center',
        }}
      >
        <main>
          <Outlet />
        </main>
      </Box>
    </>
  );
}
