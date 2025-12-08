import { Link, useLocation } from "react-router-dom";

export const Nav = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "active" : "";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-camera-reels me-2"></i>
          Sistema de Cinema
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/")}`} to="/">
                <i className="bi bi-house me-1"></i>Início
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/filmes")}`} to="/filmes">
                <i className="bi bi-film me-1"></i>Filmes
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/salas")}`} to="/salas">
                <i className="bi bi-building me-1"></i>Salas
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/sessoes")}`}
                to="/sessoes"
              >
                <i className="bi bi-clock me-1"></i>Sessões
              </Link>
            </li>
           
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/programacao")}`}
                to="/programacao"
              >
                <i className="bi bi-calendar3 me-1"></i>Programação
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/lanches")}`}
                to="/lanches"
              >
                <i className="bi bi-cup-straw me-1"></i>Lanches
              </Link>
            </li>
             <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/ingressos")}`}
                to="/ingressos"
              >
                <i className="bi bi-ticket-perforated me-1"></i>Ingressos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
