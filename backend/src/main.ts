import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  // Remove prefix /api porque o Nginx já faz o strip
  // Se preferir manter, adicione: app.setGlobalPrefix('api') e ajuste o Nginx
  const port = process.env.BACKEND_PORT ? Number(process.env.BACKEND_PORT) : 4000
  await app.listen(port, '0.0.0.0')
  console.log(`Backend listening on ${port}`)
}
bootstrap()
