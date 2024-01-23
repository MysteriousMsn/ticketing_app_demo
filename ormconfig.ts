import './src/boilerplate.polyfill';

import { UserSubscriber } from './src/entity-subscribers/user-subscriber';

export const typeormConfig = {
  type: 'mysql',
  host: `${process.env.DB_HOST}`,
  port: `${Number(process.env.DB_PORT)}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_DATABASE}`,
  subscribers: [UserSubscriber],
  entities: [
    'src/modules/**/*.entity{.ts,.js}',
    'src/modules/**/*.view-entity{.ts,.js}',
  ],
  migrations: ['src/database/migrations/*{.ts,.js}'],
};
