import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import { SignUp } from '../components/SignUp';
import { SignIn } from '../components/SignIn';
import { CreateTransport } from '../components/CreateTransport';
import { EditTransport } from '../components/EditTransport';
import { ProtectedRoute } from '../shared/ProtectedRoute/ProtectedRoute';
import { Transports } from '../components/Transports';
import { RentList } from '../components/RentList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <h2>Welcome to TRent!</h2>,
      },
      {
        path: 'signin',
        element: <SignIn />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'transports/create',
        element: (
          <ProtectedRoute roles={['ADMIN']}>
            <CreateTransport />
          </ProtectedRoute>
        ),
      },
      {
        path: 'transports/:id',
        element: (
          <ProtectedRoute>
            <EditTransport />
          </ProtectedRoute>
        ),
      },
      {
        path: 'transports',
        element: (
          <ProtectedRoute>
            <Transports />
          </ProtectedRoute>
        ),
      },
      {
        path: 'rent-list',
        element: (
          <ProtectedRoute roles={['USER']}>
            <RentList />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export { router };
