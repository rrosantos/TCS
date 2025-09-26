import React from 'react'

export default function App() {
  const styles = {
    container: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '32px 24px',
      maxWidth: 800,
      margin: '0 auto',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    },
    header: {
      marginBottom: 40,
      textAlign: 'center'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#0f172a',
      marginBottom: 16
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#64748b',
      maxWidth: 600,
      margin: '0 auto'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: 24,
      marginBottom: 40
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 24,
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    },
    cardTitle: {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    },
    cardContent: {
      color: '#475569',
      fontSize: '0.95rem',
      lineHeight: 1.6
    },
    code: {
      backgroundColor: '#f1f5f9',
      padding: '2px 6px',
      borderRadius: 4,
      fontSize: '0.9em',
      fontFamily: 'monospace'
    },
    link: {
      color: '#2563eb',
      textDecoration: 'none',
      fontWeight: 500
    },
    footer: {
      borderTop: '1px solid #e2e8f0',
      paddingTop: 24,
      color: '#64748b',
      fontSize: '0.95rem',
      textAlign: 'center',
      lineHeight: 1.6
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Tecnologia de Construção de Software:
          Ambiente de Desenvolvimento com Docker Compose</h1>
        <p style={styles.subtitle}>
          Criação de um Ambiente de Desenvolvimento Full-Stack com Docker Compose
        </p>
      </header>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span style={{ fontSize: 24 }}>🚀</span> Inicialização Única
          </div>
          <div style={styles.cardContent}>
            Todo o ambiente inicia com um único comando:<br/>
            <code style={styles.code}>docker-compose up --build</code>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span style={{ fontSize: 24 }}>🔄</span> Hot-Reload Ativo
          </div>
          <div style={styles.cardContent}>
            Alterações em <code style={styles.code}>frontend/</code> e <code style={styles.code}>backend/</code> são 
            aplicadas instantaneamente, sem necessidade de rebuild.
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span style={{ fontSize: 24 }}>🌐</span> Endpoints & Portas
          </div>
          <div style={styles.cardContent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a style={styles.link} href="/" target="_blank">Frontend: localhost:80</a>
              <a style={styles.link} href="/api/health" target="_blank">API: localhost:80/api</a>
              <a style={styles.link} href="http://localhost:5050" target="_blank">pgAdmin: localhost:5050</a>
              <span>Postgres: <code style={styles.code}>localhost:5433</code></span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span style={{ fontSize: 24 }}>🔀</span> Nginx Proxy
          </div>
          <div style={styles.cardContent}>
            Roteamento automático com strip de prefixo:<br/>
            <code style={styles.code}>/</code> → Frontend<br/>
            <code style={styles.code}>/api/*</code> → Backend
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span style={{ fontSize: 24 }}>💾</span> Persistência
          </div>
          <div style={styles.cardContent}>
            Dados do Postgres e pgAdmin persistem entre restarts via volumes Docker 
            (<code style={styles.code}>db_data</code> e <code style={styles.code}>pgadmin_data</code>).
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span style={{ fontSize: 24 }}>🛠</span> Desenvolvimento
          </div>
          <div style={styles.cardContent}>
            Teste esta página editando <code style={styles.code}>frontend/src/App.jsx</code><br/>
            Teste a API editando <code style={styles.code}>backend/src/app.controller.ts</code>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>
          Desenvolvido com Docker Compose + React/Vite + NestJS + Postgres + Nginx<br/>
        </p>
      </footer>
    </div>
  )
}
