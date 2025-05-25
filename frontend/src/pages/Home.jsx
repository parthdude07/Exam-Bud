import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    fetch('http://localhost:4000/branches')
      .then(r => r.json())
      .then(setBranches);
  }, []);
  return (
    <div>
      <h2>Branches</h2>
      <ul>
        {branches.map(b =>
          <li key={b.id}>
            <Link to={`/branch/${b.id}`}>{b.name}</Link>
          </li>
        )}
      </ul>
    </div>
  );
}
