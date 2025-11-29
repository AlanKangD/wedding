import Account from './components/Account';
import Gallery from './components/Gallery';
import Hero from './components/Hero';
import Invitation from './components/Invitation';
import Location from './components/Location';
import Message from './components/Message';

function App() {
  return (
    <div className="app-container">
      <main>
        <Hero />
        <Invitation />
        <Gallery />
        <Location />
        <Account />
        <Message />
      </main>
    </div>
  );
}

export default App;
