"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    const port = process.env.BACKEND_PORT ? Number(process.env.BACKEND_PORT) : 4000;
    await app.listen(port, '0.0.0.0');
    console.log(`Backend listening on ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map