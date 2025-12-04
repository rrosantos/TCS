import { Link } from "react-router-dom";

export const HomePage = () => {
    return (
        <div className="container mt-4">
            {/* Hero Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="p-5 bg-primary text-white rounded-3 text-center">
                        <i className="bi bi-camera-reels display-1 mb-3"></i>
                        <h1 className="display-4">Sistema de Cinema</h1>
                        <p className="lead">Gerencie filmes, salas, sessões e vendas de ingressos</p>
                    </div>
                </div>
            </div>

            {/* Cards de Módulos */}
            <div className="row">
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <i className="bi bi-film display-1 text-primary mb-3"></i>
                            <h5 className="card-title">Filmes</h5>
                            <p className="card-text">Cadastre filmes com título, sinopse, classificação e período de exibição.</p>
                            <Link to="/filmes" className="btn btn-cinema">
                                <i className="bi bi-camera-reels me-2"></i>Gerenciar Filmes
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <i className="bi bi-building display-1 text-primary mb-3"></i>
                            <h5 className="card-title">Salas</h5>
                            <p className="card-text">Configure salas com número e capacidade máxima de espectadores.</p>
                            <Link to="/salas" className="btn btn-cinema">
                                <i className="bi bi-door-open me-2"></i>Gerenciar Salas
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <i className="bi bi-clock display-1 text-primary mb-3"></i>
                            <h5 className="card-title">Sessões</h5>
                            <p className="card-text">Programe sessões vinculando filmes às salas com data e horário.</p>
                            <Link to="/sessoes" className="btn btn-cinema">
                                <i className="bi bi-calendar-plus me-2"></i>Programar Sessões
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm border-success">
                        <div className="card-body text-center">
                            <i className="bi bi-ticket-perforated display-1 text-success mb-3"></i>
                            <h5 className="card-title">Ingressos</h5>
                            <p className="card-text">Visualize histórico de vendas de ingressos (inteira e meia).</p>
                            <Link to="/ingressos" className="btn btn-success">
                                <i className="bi bi-ticket-detailed me-2"></i>Ver Ingressos Vendidos
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm border-info">
                        <div className="card-body text-center">
                            <i className="bi bi-calendar-week display-1 text-info mb-3"></i>
                            <h5 className="card-title">Programação</h5>
                            <p className="card-text">Visualize a programação completa do cinema por data.</p>
                            <Link to="/programacao" className="btn btn-info text-white">
                                <i className="bi bi-calendar-check me-2"></i>Ver Programação
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info sobre venda */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        <strong>Dica:</strong> Para vender ingressos, acesse o módulo de <Link to="/sessoes" className="alert-link">Sessões</Link> e clique no botão "Vender" na sessão desejada.
                    </div>
                </div>
            </div>
        </div>
    );
};
