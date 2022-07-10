import './App.css';

import { Routes, Route } from 'react-router-dom';
import Book from './Book/Book';
import LogIn from './LogIn/LogIn';
import SignUp from './SignUp/SignUp';
import Header from './Header/Header';
import Home from './Home/Home';
import LibraryNew from './Library/LibraryEdit';
import Container from '@mui/material/Container';
import Library from './Library/Library';

function setUser(user) {
  sessionStorage.setItem('user', JSON.stringify(user));
  window.location.href = '/';
}

function getUser() {
  const userString = sessionStorage.getItem('user');
  const user = JSON.parse(userString);
  return user;
}

function App() {
  const user = getUser();

  if (!user?.loggedIn) {
    return (
      <div className="App">
        <Header user={user} setUser={setUser} />

        <Container>
          <Routes>
            <Route path="/login" element={<LogIn setUser={setUser} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<LogIn setUser={setUser} />} />
          </Routes>
        </Container>
      </div>
    );
  }

  return (
    <div className="App">
      <Header user={user} setUser={setUser} />

      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library/new" element={<LibraryNew isNew={true} />} />
          <Route
            path="/library/edit/:id"
            element={<LibraryNew sNew={false} />}
          />
          <Route path="/library/:id" element={<Library />} />
          <Route path="/book/edit/:id" element={<Book />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
