import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW SERVER_VERSION");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW MAX_CONNECTIONS;",
  );

  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });
  const databaseConnectionsValue = databaseConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,

    //database_version_value: databaseVersionValue,
    // database_max_conections_value: databaseMaxConectionsValue,
    // opened_connections_value: openedConnectionsValue,

    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        database_connections: databaseConnectionsValue,
      },
    },
  });
}

export default status;
