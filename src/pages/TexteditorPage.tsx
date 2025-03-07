import { useState, useEffect, useLayoutEffect } from "react";
import ReactQuill from "react-quill";
import { Document, Packer, Paragraph } from "docx";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import customfetch from '../Utils/Customfetch.ts';
import Cookies from 'js-cookie';



const TexteditorPage = () => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [title, setHeading] = useState("");
  const [saveTriggered, setSaveTriggered] = useState(false);
  const navigate = useNavigate()

  const [user, setUser] = useState({
    email: "",
    name: "",
    image: "",
    googleId: "",
  });
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(""); // To capture any error
  // const googleId = Cookies.get('googleId');
  // if (!googleId) {
  //   navigate('/Login')
  // } 

const googleId = localStorage.getItem('user'); // This can be 'string | null'

if (googleId) {
  const parsedUser = JSON.parse(googleId); // 'user' is guaranteed to be a string at this point
  console.log('Logged in user:', parsedUser);
} else {
  navigate('/Login');
}


  useLayoutEffect(() => {
    console.log("cookie",googleId)
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await customfetch.post('/userDetails', { googleId });
        console.log("User data fetched:", response.data);
        setUser(response.data.user);
        setFiles(response.data.user.notes.reverse());
        console.log("User data fies:",response.data.user.notes);

      } catch (error) {
        setError("Failed to fetch user data.");
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); 

  useEffect(() => {
    const fetchUserNotes = async () => {
      setLoading(true);
      try {
        const response = await customfetch.post('/files', { googleId });
        // const response = await axios.post("/userDetails", { googleId }); // Replace with your API endpoint
        console.log("User data in useeffect:", response.data);
        setFiles(response.data.user.notes.reverse());
        setSaveTriggered(false);
      } catch (error) {
        setError("Failed to fetch user data.");
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNotes();
  }, [saveTriggered]);

  
  const userLogout =async () => {
    // Implement logout functionality
      const response = await customfetch.get('/logout');
      
          console.log("response",response)
          if (response.status === 200) {
            localStorage.removeItem('googleId')
            navigate('/Home')
          } else {
            alert('Failed to upload the file!');
          }
    }


  const handleSave = async () => {
    if (!title) {
      alert("Please enter a title before saving.");
      return;
    }
    
    try {
      // Send POST request using axios
      const response = await customfetch.post('/saveNotes', {
        title,
        content,
        googleId
      });
      if (response.status === 200) {
        // If the response is OK (200), show success alert
        alert('document saved succesfully')
        setContent('')
        setHeading('')
        setSaveTriggered(true);
      } else {
        // In case of any other status code (non-200)
        alert('Failed to upload the file!');
      }
    } catch (err) {
      // Handle errors
      console.error('Error saving document:', err);
      alert('Error saving document');
    }

  };

  const handleDelete = async (id: any) => {
    console.log("id",`${id}`)
    try {
      const response = await customfetch.delete(`/files/${googleId}/${id}`);
  
      if (response.status === 200) {
        setFiles(response.data.user.notes.reverse());
        setContent("");
        setHeading("");
        alert("File deleted successfully!");
      } else {
        alert("Failed to delete the file.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("An error occurred while deleting the file.");
    }
  };
  


  const handleUploadToDrive = async () => {
    if (!title) {
      alert("Please enter a heading before uploading.");
      return;
    }
  
    // Convert Quill content to plain text
    const plainText = content.replace(/<[^>]*>/g, "");
  
    // Create a .docx document
    const doc = new Document({
      sections: [{ properties: {}, children: [new Paragraph(plainText)] }],
    });
  
    // Convert document to Blob
    const blob = await Packer.toBlob(doc);
  
    // Create FormData to send to API
    const formData = new FormData();
    formData.append("file", new File([blob], `${title}.docx`, { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
  
    try {
      const response = await customfetch.post("/drive", formData);
      if (response.status === 200) {
        alert("File uploaded successfully!");
        setContent("");
    setHeading("");
      } else {
        alert("Failed to upload the file!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading.");
    }
  };
  

  const handleNewNote = () => {
    setContent("");
    setHeading("");
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  // Handle error state
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 bg-blue-600 text-white shadow-md flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold"></h2>
      <h2 className="text-lg font-semibold"></h2>
        <h2 className="text-lg font-semibold">Welcome to Text Editor</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{user?.name}</span>
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <img
            src={user.image}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
            </div>
          <button className="px-4 py-2 rounded-md bg-red-500 text-white" onClick={userLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-white p-4 shadow-lg">
          <nav className="space-y-4">
            <button onClick={handleNewNote} className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 rounded-md">
              + Add New Note
            </button>
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">My Files</h3>
              {files.length > 0 ? (
                <ul className="space-y-2">
                  {files.map((file) => (
                    <li key={file._id} onClick={() => { setHeading(file.title); setContent(file.content || ""); }} className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
                      <span >{file.title}</span>
                      <button className="px-2 py-1 bg-red-500 text-white rounded-md" onClick={() => handleDelete(file._id)}>Delete</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No files available</p>
              )}
            </div>
          </nav>
        </aside>

        <div className="flex-1 p-4 flex flex-col">
          <input 
            type="text" 
            className="w-full p-2 mb-4 border border-gray-300 rounded-md" 
            placeholder="Enter document title..." 
            value={title} 
            onChange={(e) => setHeading(e.target.value)}
          />
          <ReactQuill value={content} onChange={setContent} theme="snow" className="h-100 mb-4" />
          <div className="flex justify-end gap-4 mt-9">
              <button className="px-4 py-2 bg-green-500 text-white rounded-md" onClick={handleSave}>
                Save
              </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleUploadToDrive}>
              Upload to Drive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TexteditorPage;
