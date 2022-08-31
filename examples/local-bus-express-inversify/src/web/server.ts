import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';

import { container } from '@src/infra/ioc.container';

import '@src/app/services';
import '@src/web/controllers'; // required to setup decorator metadata => auto registration

const PORT = 3000; // or from config

const serverBuilder = new InversifyExpressServer(container);

// serverBuilder.setConfig((app) => {});

const app = serverBuilder.build();

app.listen(PORT, '0.0.0.0', () => {
  // logger.info
  console.info(`Application started http://127.0.0.1:${PORT}`);
});
