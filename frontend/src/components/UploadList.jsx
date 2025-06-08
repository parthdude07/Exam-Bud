import { useEffect, useState } from 'react';

export default function UploadList({ subjectId }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const load = ()=>fetch(`http://localhost:4000/subjects/${subjectId}/uploads`)
    .then(r=>r.json())
    .then(res => setItems(res.data));

  useEffect(load, [subjectId]);

  const add = async e => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('file', file);
    await fetch(`http://localhost:4000/subjects/${subjectId}/uploads`, {
      method:'POST',
      headers: { 'x-user-id': 1, 'x-user-role': 'USER' },
      body: fd
    });
    setTitle(''); setFile(null);
    load();
  };

  const del = async id => {
    await fetch(`http://localhost:4000/uploads/${id}`, { method:'DELETE' });
    load();
  };

  return (
    <div>
      <h2>Materials</h2>
      <form onSubmit={add}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required/>
        <input type="file" onChange={e=>setFile(e.target.files[0])} required/>
        <button type="submit">Upload</button>
      </form>
      <ul>
        {items.map(u=>(
          <li key={u.id}>
            <a href={`http://localhost:4000${u.url}`} target="_blank">{u.title}</a>
            <span> by {u.user.name}</span>
            <button onClick={()=>del(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
