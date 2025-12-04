import { Link } from "react-router-dom";

export const HomePage = () => {
    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <i className="bi bi-film display-1 text-primary mb-3"></i>
                            <h5 className="card-title">Filmes</h5>
                            <p className="card-text">Cadastre filmes com título, sinopse, elenco e período de exibição.</p>
                            <Link to="/filmes" className="btn btn-cinema">
                                <i className="bi bi-plus-circle me-2"></i>Gerenciar Filmes
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <i className="bi bi-building display-1 text-primary mb-3"></i>
                            <h5 className="card-title">Salas</h5>
                            <p className="card-text">Configure salas com número, capacidade e mapa de poltronas.</p>
                            <Link to="/salas" className="btn btn-cinema">
                                <i className="bi bi-plus-circle me-2"></i>Gerenciar Salas
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <i className="bi bi-clock display-1 text-primary mb-3"></i>
                            <h5 className="card-title">Sessões</h5>
                            <p className="card-text">Programe sessões vinculando filmes às salas com horários.</p>
                            <Link to="/sessoes" className="btn btn-cinema">
                                <i className="bi bi-plus-circle me-2"></i>Programar Sessões
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <i className="bi bi-ticket-perforated display-1 text-info mb-3"></i>
                            <h5 className="card-title">Ingressos</h5>
                            <p className="card-text">Configure valores de inteira e meia para cada sessão.</p>
                            <Link to="/ingressos" className="btn btn-info text-white">
                                <i className="bi bi-plus-circle me-2"></i>Gerenciar Ingressos
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <i className="bi bi-cup-straw display-1 text-warning mb-3"></i>
                            <h5 className="card-title">Lanches e Combos</h5>
                            <p className="card-text">Cadastre lanches e combos disponíveis para venda.</p>
                            <Link to="/lanches" className="btn btn-warning">
                                <i className="bi bi-plus-circle me-2"></i>Gerenciar Lanches
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <i className="bi bi-cart display-1 text-success mb-3"></i>
                            <h5 className="card-title">Pedidos</h5>
                            <p className="card-text">Realize vendas de ingressos e lanches aos clientes.</p>
                            <Link to="/pedidos" className="btn btn-success">
                                <i className="bi bi-cart-plus me-2"></i>Novo Pedido
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
