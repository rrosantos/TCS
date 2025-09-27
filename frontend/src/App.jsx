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
            <span style={{ fontSize: 24 }}>📱</span> Frontend
          </div>
          <div style={styles.cardContent}>
            Container:<code style={styles.code}>tcs_frontend_1</code><br/>
            Porta: <code style={styles.code}>3000</code>
            <a style={styles.link} href="/" target="_blank">(http://localhost:3000)</a><br/>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span style={{ fontSize: 24 }}>⚙️</span> Backend
          </div>
          <div style={styles.cardContent}>
            Container:<code style={styles.code}>tcs_backend_1</code><br/>
            Porta: <code style={styles.code}>4000</code>
            <a style={styles.link} href="/api/health" target="_blank">(http://localhost:4000/api/health)</a><br/>
            Status: Healthy<br/>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span style={{ fontSize: 24 }}>🗄️</span> Banco de dados PostgreSQL
          </div>
          <div style={styles.cardContent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              Container:<code style={styles.code}>tcs_db_1</code><br/>
              Porta: <code style={styles.code}>5432</code>
              Status: Healthy<br/>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span style={{ fontSize: 24 }}>🔧</span> PgAdmin
          </div>
          <div style={styles.cardContent}>
            Container:<code style={styles.code}>tcs_pgadmin_1</code><br/>
            Porta: <code style={styles.code}>5050</code><a style={styles.link} href="http://localhost:5050" target="_blank">(http://localhost:5050)</a><br/>
            Credenciais:<br/>
            Usuário: <code style={styles.code}>admin@tcs.com</code><br/>
            Senha: <code style={styles.code}>admin123</code><br/>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span style={{ fontSize: 24 }}>🌐</span> Nginx (Proxy reverso)
          </div>
          <div style={styles.cardContent}>
            Container:<code style={styles.code}>tcs_nginx_1</code><br/>
            Porta: <code style={styles.code}>80</code><a style={styles.link} href="http://localhost:8080" target="_blank">(http://localhost:8080)</a><br/>
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
    </div>
  )
}
