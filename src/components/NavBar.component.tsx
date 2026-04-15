import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../state/UserContext';

export default function NavBar() {
  const user = useContext(UserContext);

  return (
    <ul>
      <li>
        <Link to={"/books"}>Books</Link>
      </li>
      <li style={{ display: user ? 'list-item' : 'none' }}>
        <Link to={"/add-new-book"}>Add new book</Link>
      </li>
    </ul>
  );
}