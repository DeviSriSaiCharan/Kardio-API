import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { User } from '@modules/users/entities/users.entity';
import { Workspace } from '@modules/workspaces/entities/workspace.entity';

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
}

const port = Number.parseInt(required('DB_PORT'), 10);
if (!Number.isFinite(port)) {
  throw new Error('DB_PORT must be a valid number');
}

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: required('DB_HOST'),
  port: port,
  username: required('DB_USERNAME'),
  password: required('DB_PASSWORD'),
  database: required('DB_NAME'),
  entities: [User, Workspace],
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
