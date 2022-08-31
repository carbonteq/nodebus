import type { Router } from 'express';

export interface Controller {
  readonly prefix?: string;

  getRouter(): Router;
}
