import { Nav, Footer } from "./components";
import { AppRouter } from "./routers/app.routers";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Nav />
      <main className="flex-grow-1">
        <AppRouter />
      </main>
      <Footer />
    </div>
  );
}

export default App;
