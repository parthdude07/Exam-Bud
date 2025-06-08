import { useEffect, useState } from 'react';

export default function DiscussionList({ subjectId }) {
  const [list, setList] = useState([]);
  const [txt, setTxt] = useState('');
  
  const load = ()=>fetch(`http://localhost:4000/subjects/${subjectId}/discussions`)
  .then(r=>r.json())
  .then(res => setList(res.data));
  
  useEffect(load, [subjectId]);
  
  const post = async e => {
    e.preventDefault();
    await fetch(`http://localhost:4000/subjects/${subjectId}/discussions`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'x-user-id':1 },
      body: JSON.stringify({ content: txt })
    });
    setTxt('');
    load();
  };

  return (
    <div>
      <h2>Discussion</h2>
      <form onSubmit={post}>
        <textarea value={txt} onChange={e=>setTxt(e.target.value)} required/>
        <button type="submit">Post</button>
      </form>
      <ul>
        {list.map(d=>(
          <li key={d.id}>
            <p>{d.content}</p>
            <small>— {d.user.name} at {new Date(d.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
