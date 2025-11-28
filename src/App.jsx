import Gallery from './components/Gallery';
import Hero from './components/Hero';
import Invitation from './components/Invitation';
import Location from './components/Location';
import Movie from './components/Movie';
import Account from './components/Account';
import RSVP from './components/RSVP';
import Message from './components/Message';

function App() {
  return (
    <div className="app-container">
      <main>
        <Hero />
        <Invitation />
        <Gallery />
        <Movie />
        <Location />
        <Account />
        <RSVP />
        <Message />
      </main>
    </div>
  );
}

export default App;
