import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Create simple authentication form components (Sign-Up / Log-In)
const AuthForm = ({ type, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = type === 'signup' ? 'http://localhost:4000/api/auth/signup' : 'http://localhost:4000/api/auth/login';

    axios
      .post(apiUrl, { email, password })
      .then((response) => {
        // Store user data (e.g., JWT token or user info)
        localStorage.setItem('user', JSON.stringify(response.data));
        onAuthSuccess(response.data);
      })
      .catch((err) => {
        setError('Authentication failed. Please try again.');
        console.error(err);
      });
  };

  return (
    <div>
      <h2>{type === 'signup' ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{type === 'signup' ? 'Sign Up' : 'Log In'}</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

// Create Video Upload Form Component
const VideoUploadForm = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', title);
    formData.append('description', description);

    axios
      .post('http://localhost:4000/api/video/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Video uploaded successfully:', response.data);
        // Optionally, update the video list to show the newly uploaded video
      })
      .catch((error) => {
        console.error('Error uploading video:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={handleVideoChange}
        accept="video/*"
        required
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Upload Video</button>
    </form>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    // Fetch videos when the component mounts
    axios
      .get('http://localhost:4000/api/video')
      .then((response) => {
        setVideos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching videos:', error);
      });
  }, []);

  // Fetch comments for a video
  const fetchComments = (id) => {
    setVideoId(id);
    axios
      .get(`http://localhost:4000/api/video/${id}/comments`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  };

  // Post a new comment
  const handleSubmitComment = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:4000/api/video/${videoId}/comment`, { comment: newComment })
      .then((response) => {
        setComments([...comments, response.data]); // Update the comment list with the new comment
        setNewComment('');
      })
      .catch((error) => {
        console.error('Error submitting comment:', error);
      });
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <div className="App">
      <h1>Rate My Chinese - Videos</h1>

      {/* Conditional rendering for authentication */}
      {!user ? (
        <div>
          <AuthForm type="signup" onAuthSuccess={handleAuthSuccess} />
          <AuthForm type="login" onAuthSuccess={handleAuthSuccess} />
        </div>
      ) : (
        <div>
          <p>Welcome, {user.email}!</p>
          <VideoUploadForm /> {/* Show video upload form if user is logged in */}

          {/* Video List */}
          <h2>Videos</h2>
          <ul>
            {videos.map((video) => (
              <li key={video.id}>
                {video.title} <button onClick={() => fetchComments(video.id)}>View Comments</button>
              </li>
            ))}
          </ul>

          {/* Comments Section */}
          {videoId && (
            <>
              <h3>Comments</h3>
              <ul>
                {comments.map((comment) => (
                  <li key={comment.id}>{comment.text}</li>
                ))}
              </ul>

              {/* Add a new comment */}
              <form onSubmit={handleSubmitComment}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment here"
                  required
                />
                <button type="submit">Submit Comment</button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
