type GetMongoConnectionStringType = {
  username?: string;
  password?: string;
  host?: string;
  port?: string;
  databaseName?: string;
  authDatabase?: string;
};

export function getMongoConnectionString({
  username,
  password,
  host,
  port,
  databaseName,
  authDatabase,
}: GetMongoConnectionStringType): string {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=${authDatabase}`;
}
