import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import { SignUp } from '../components/SignUp';
import { SignIn } from '../components/SignIn';
import { CreateTransport } from '../components/CreateTransport';
import { EditTransport } from '../components/EditTransport';
import { ProtectedRoute } from '../shared/ProtectedRoute/ProtectedRoute';
import { Transports } from '../components/Transports';

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
        path: 'dashboard',
        element: <CreateTransport />,
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
    ],
  },
]);

export { router };
