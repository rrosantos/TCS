export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <h5 className="mb-2">
              <i className="bi bi-camera-reels me-2"></i>
              Sistema de Cinema
            </h5>
            <p className="mb-0 text-muted">
              Gerenciamento completo de filmes, salas e sessões
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <p className="mb-1">
              <i className="bi bi-envelope me-2"></i>
              contato@cinema.com.br
            </p>
            <p className="mb-0 text-muted">
              © {currentYear} - Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
