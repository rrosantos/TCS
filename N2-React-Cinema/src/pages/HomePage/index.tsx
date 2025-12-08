import { Link } from "react-router-dom";
import { Container, Card, CardBody, Button, Alert } from "../../components";

export const HomePage = () => {
  return (
    <Container>
      {/* Hero Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="p-5 bg-primary text-white rounded-3 text-center">
            <i className="bi bi-camera-reels display-1 mb-3"></i>
            <h1 className="display-4">Sistema de Cinema</h1>
            <p className="lead">
              Gerencie filmes, salas, sessões e vendas de ingressos
            </p>
          </div>
        </div>
      </div>

      {/* Cards de Módulos */}
      <div className="row">
        <div className="col-lg-4 col-md-6 mb-4">
          <Card shadow border="primary" className="h-100">
            <CardBody className="text-center">
              <i className="bi bi-film display-1 text-primary mb-3 d-block"></i>
              <h5 className="card-title">Filmes</h5>
              <p className="card-text">
                Cadastre filmes com título, sinopse, classificação e período de
                exibição.
              </p>
              <Link to="/filmes">
                <Button variant="primary" icon="camera-reels">
                  Gerenciar Filmes
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>

        <div className="col-lg-4 col-md-6 mb-4">
          <Card shadow className="h-100 border-purple">
            <CardBody className="text-center">
              <i className="bi bi-building display-1 text-purple mb-3 d-block"></i>
              <h5 className="card-title">Salas</h5>
              <p className="card-text">
                Configure salas com número e capacidade máxima de espectadores.
              </p>
              <Link to="/salas">
                <Button className="btn-purple" icon="door-open">
                  Gerenciar Salas
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>

        <div className="col-lg-4 col-md-6 mb-4">
          <Card shadow border="danger" className="h-100">
            <CardBody className="text-center">
              <i className="bi bi-clock display-1 text-danger mb-3 d-block"></i>
              <h5 className="card-title">Sessões</h5>
              <p className="card-text">
                Programe sessões vinculando filmes às salas com data e horário.
              </p>
              <Link to="/sessoes">
                <Button variant="danger" icon="calendar-plus">
                  Programar Sessões
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>

        <div className="col-lg-4 col-md-6 mb-4">
          <Card shadow border="success" className="h-100">
            <CardBody className="text-center">
              <i className="bi bi-ticket-perforated display-1 text-success mb-3 d-block"></i>
              <h5 className="card-title">Ingressos</h5>
              <p className="card-text">
                Visualize histórico de vendas de ingressos (inteira e meia).
              </p>
              <Link to="/ingressos">
                <Button variant="success" icon="ticket-detailed">
                  Ver Ingressos Vendidos
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>

        <div className="col-lg-4 col-md-6 mb-4">
          <Card shadow border="info" className="h-100">
            <CardBody className="text-center">
              <i className="bi bi-calendar-week display-1 text-info mb-3 d-block"></i>
              <h5 className="card-title">Programação</h5>
              <p className="card-text">
                Visualize a programação completa do cinema por data.
              </p>
              <Link to="/programacao">
                <Button variant="info" icon="calendar-check">
                  Ver Programação
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>

        <div className="col-lg-4 col-md-6 mb-4">
          <Card shadow border="warning" className="h-100">
            <CardBody className="text-center">
              <i className="bi bi-cup-straw display-1 text-warning mb-3 d-block"></i>
              <h5 className="card-title">Lanches</h5>
              <p className="card-text">
                Gerencie lanches, bebidas, combos e faça pedidos para clientes.
              </p>
              <Link to="/lanches">
                <Button variant="warning" icon="cup-straw">
                  Gerenciar Lanches
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
  );
};
