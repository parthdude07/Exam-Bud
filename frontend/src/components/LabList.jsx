import { useEffect, useState } from 'react';
import share_icon from '../assets/share_icon.png';
import download_icon from '../assets/download_icon.png';
import notes_icon from '../assets/notes_icon.png';
import star_unfilled from '../assets/star 0.png';
import star_filled from '../assets/star 1.png';

export default function LabList({ subjectId, searchQuery = '' }) {
  const [labs, setLabs] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const load = () => {
    try {
      fetch(`http://localhost:4000/subjects/${subjectId}/labs`)
        .then(r => r.json())
        .then(res => setLabs(res.data));
    } catch (err) {
      console.error('Error in load:', err);
    }
  };

  useEffect(() => {
    load();

    return () => {
      try {
        // No cleanup needed now, but placeholder added for safety
      } catch (err) {
        console.error('Cleanup error in LabList:', err);
      }
    };
  }, [subjectId]);

  const add = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('file', file);
      await fetch(`http://localhost:4000/subjects/${subjectId}/labs`, {
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
      await fetch(`http://localhost:4000/labs/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      console.error('Error in delete:', err);
    }
  };

  return (
    <div className="min-w-[80vw] mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center text-white">Lab Materials</h2>

      <form
        id='labs'
        onSubmit={add}
        className="flex flex-col md:flex-row items-center justify-center gap-4"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="w-full md:w-1/3 text-sm"
        />
        <button
          type="submit"
          form='labs'
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Upload Lab
        </button>
      </form>

      <ul className="space-y-4">
        {(searchQuery
          ? labs.filter(
            (l) =>
              l.title.toString().toLowerCase().includes(searchQuery.toString().toLowerCase()) ||
              l.user.name.toString().toLowerCase().includes(searchQuery.toString().toLowerCase())
          )
          : labs)
          .map((l) => (
            <li
              key={l.id}
              className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl shadow-md"
            >
              <div>
                <img src={notes_icon} alt="icon" />
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <a
                  href={`http://localhost:4000${l.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-semibold text-blue-700 hover:underline"
                >
                  {l.title}
                </a>
                <span className="text-sm text-gray-500">by {l.user.name}</span>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <img src={share_icon} alt="share" />
                </div>
                <a
                  href={`http://localhost:4000${l.url}`}
                  download
                  className="text-sm text-blue-600 hover:underline hover:text-blue-800"
                >
                  <img src={download_icon} alt="download" />
                </a>
                <div>
                  <img src={star_unfilled} alt="favourites" />
                </div>
                <button
                  onClick={() => del(l.id)}
                  className="text-sm text-red-500 hover:underline hover:text-red-700"
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
