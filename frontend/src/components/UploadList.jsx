import { useEffect, useState } from 'react';
import share_icon from '../assets/share_icon.png';
import download_icon from '../assets/download_icon.png';
import notes_icon from '../assets/notes_icon.png';
import star_unfilled from '../assets/star 0.png';
import star_filled from '../assets/star 1.png';

export default function UploadList({ subjectId ,searchQuery=''}) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const load = () => {
    try {
      fetch(`http://localhost:4000/subjects/${subjectId}/uploads`)
        .then(r => r.json())
        .then(res => setItems(res.data));
    } catch (err) {
      console.error('Error in load:', err);
    }
  };

  useEffect(() => {
    load();

    return () => {
      try {
        // optional cleanup (not needed here)
      } catch (err) {
        console.error('Cleanup error in UploadList:', err);
      }
    };
  }, [subjectId]);

  const add = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('file', file);
      await fetch(`http://localhost:4000/subjects/${subjectId}/uploads`, {
        method: 'POST',
        headers: { 'x-user-id': 1, 'x-user-role': 'USER' },
        body: fd
      });
      setTitle('');
      setFile(null);
      load();
    } catch (err) {
      console.error('Error in add:', err);
    }
  };

  const del = async (id) => {
    try {
      await fetch(`http://localhost:4000/uploads/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      console.error('Error in delete:', err);
    }
  };

  return (
    <div className="min-w-[80vw] mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-center text-white">Notes</h2>

      <form
        id='notes'
        onSubmit={add}
        className="flex flex-col md:flex-row gap-4 items-center justify-center"
      >
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full md:w-1/3 px-4 py-2 rounded-xl border border-gray-300"
        />
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          required
          className="w-full md:w-1/3"
        />
        <button
          type="submit"
          form='notes'
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Upload
        </button>
      </form>

      <ul className="space-y-4">
        {(searchQuery ? ( items
          .filter((u) =>
            u.title.toString().toLowerCase().includes(searchQuery.toString().toLowerCase()
             )
          )):items).map(u => (
          <li
            key={u.id}
            className="flex flex-col md:flex-row md:items-center justify-between bg-white shadow-md rounded-2xl px-4 py-3"
          >
            <div>
              <img src={notes_icon} alt="icon" />
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <a
                href={`http://localhost:4000${u.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-blue-800 hover:underline"
              >
                {u.title}
              </a>
              <span className="text-sm text-gray-500">by {u.user.name}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <div>
                <img src={share_icon} alt="share" />
              </div>
              <a
                href={`http://localhost:4000${u.url}`}
                download
                className="text-blue-500 hover:text-blue-700"
              >
                <img src={download_icon} alt="download" />
              </a>
              <div>
                <img src={star_unfilled} alt="favourites" />
              </div>
              <button
                onClick={() => del(u.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
