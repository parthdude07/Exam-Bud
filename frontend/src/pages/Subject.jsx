import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import UploadList from '../components/UploadList';
import DiscussionList from '../components/DiscussionList';
import LabList from '../components/LabList';
import Navbar from '../components/Navbar';
import backArrow from '../assets/back_arrow.svg';




export default function Subject() {
  const { branchId, semesterId, subjectId } = useParams();
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`http://localhost:4000/semesters/${semesterId}/subjects`);
        const data = await response.json();
        setSubs(data?.data || []);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, [semesterId]);

  const subject = subs.find(s => s.id === parseInt(subjectId));
  return (
    <div>
      <Navbar />
      <div
        className="body-font bg-blue-700 min-h-[90vh] w-screen w-full rounded-lg"
        style={{ background: 'rgba(20, 45, 111, 1)' }}
      >
        <div className="container px-5 py-24 mx-auto">
          <Link to={`/branch/${branchId}/semester/${semesterId}`}>
            <div className="relative mt-16 ml-2">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-3xl transition-shadow shadow-md"
                style={{
                  background: 'rgba(20, 45, 111, 1)',
                  border: '2px solid rgba(163, 189, 255, 1)',
                }}
              >
                <img src={backArrow} alt="Back" className="h-8 w-6" />
              </div>
            </div>
          </Link>


          <div className="flex flex-col items-center text-center w-full px-6 py-12  rounded-lg shadow-sm">
            <h1 className="sm:text-3xl text-2xl font-bold title-font mb-4 text-white-900">
              {subject ? subject.name : 'Loading...'}
            </h1>

            <p className="lg:w-1/2 w-full text-white-600 mb-10 text-base">
              All materials in one place, neatly organized and easily accessible.
            </p>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div className="">
                <UploadList subjectId={subjectId} />
              </div>
              <div className="">
                <DiscussionList subjectId={subjectId} />
              </div>
              <div className="">
                <LabList subjectId={subjectId} />
              </div>
            </div>
          </div>
         </div>
      </div>
      
    </div>
  );
}
