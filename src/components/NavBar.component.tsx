import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../state/UserContext';

export default function NavBar() {
  const user = useContext(UserContext);

  return (
    <div className=" bg-gray-100 p-4 flex flex-1 flex-col gap-2 mt-1 w-60">
      <button className="bg-slate-500 hover:bg-slate-700 text-white text-xl font-semibold rounded-lg shadow-md transition-all duration-200 w-full border border-slate-700 hover:shadow-lg">
        <Link to="/books" className="block w-full h-full">Books</Link>
      </button>
      {user && (
        <button className="bg-slate-500 hover:bg-slate-600 text-white text-xl font-semibold rounded-lg shadow-md transition-all duration-200 w-full border border-slate-600 hover:shadow-lg">
          <Link to="/add-new-book" className="block w-full h-full">New book</Link>
        </button>
      )}
    </div>
  );
}