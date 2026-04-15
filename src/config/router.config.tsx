import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout.component';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{
      path: 'books',
      element: (<div>My-Books</div>)
    }, {
      path: 'add-new-book',
      element: (<div>Add new Book</div>)
    }]
  },
  { path: '*', element: (<div>Errore</div>) }
]);
