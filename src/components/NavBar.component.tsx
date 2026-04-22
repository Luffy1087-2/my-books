import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../state/UserContext';

export default function NavBar() {
  const user = useContext(UserContext);

  return (
    <ul>
      <li className='bg-red-500 text-2xl'>
        <Link to={"/books"}>Books</Link>
      </li>
      <li className='bg-green-700 text-2xl' style={{ display: user ? 'list-item' : 'none' }}>
        <Link to={"/add-new-book"}>Add new book</Link>
      </li>
    </ul>
  );
}