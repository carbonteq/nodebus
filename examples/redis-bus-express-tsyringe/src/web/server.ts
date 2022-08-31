import 'reflect-metadata';
import * as morgan from 'morgan';
import * as express from 'express';

// Decorator + ioc registration
import '@src/app/services';
import '@src/infra/ioc';

import { setupRoutes } from '@src/web/controllers';

const PORT = 3000; // or from config

const app = express();

app.use(morgan('tiny'));

setupRoutes(app);

app.listen(PORT, '0.0.0.0', () => {
  // logger.info
  console.info(`Application started http://127.0.0.1:${PORT}`);
});
