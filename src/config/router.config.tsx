import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../components/Layout.component';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{
      index: true,
      element: (<Navigate to={'/books'} replace />)
    }, {
      path: 'users',
      element: (<div>Users</div>)
    }, {
      path: 'books',
      element: (<div>My-Books Content</div>)
    }, {
      path: 'add-new-book',
      element: (<div>Add new Book Content</div>)
    }]
  },
  { path: '*', element: (<Navigate to={'/books'} replace />) }
]);

