import sql from 'mssql';

const mssqlConfig: sql.config = {
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_DB,
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const poolPromise = new sql.ConnectionPool(mssqlConfig).connect();
// .then((pool) => {
//   console.log('Connected to MSSQL');
//   return pool;
// })
// .catch((err) => console.log('Database Connection Failed! Bad Config:', err));

export default poolPromise;
