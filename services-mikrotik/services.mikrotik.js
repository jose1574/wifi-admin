const RouterOSClient = require("routeros-client").RouterOSClient;

const mikrotikConfig = {
  host: process.env.MIKROTIK_HOST || "172.16.32.1",
};

//crea la conexion con la base de datos
async function createMikrotikConnection(req) {
  const { username, password } = req.session.mikrotikCreds;
  console.log("usuario: ", username);
  return new RouterOSClient({
    host: mikrotikConfig.host,
    user: username,
    password: password,
    keepalive: true,
  });
}

async function getHotspotProfUsers(req) {
  try {
    const conn = await createMikrotikConnection(req);
    const client = await conn.connect();
    const result = await client.menu("/ip hotspot user profile print");
    console.log("estos son los resultados de los perfiles");

    conn.close();
    return result;
  } catch (error) {
    throw new Error(
      "ocurrio un error al buscar los perfiles de usuarios: ",
      error
    );
  }
}

async function createUserHotspot(server, profile, name, password) {
  try {
    const conn = await createMikrotikConnection(req);
    const client = await conn.connect();
    const queryUser = client.menu("/ip hotspot user");
    const result = await queryUser.add({
      server,
      profile,
      name,
      password,
    });
    return result;
  } catch (error) {
    throw new Error("ocurrio un error al añadir un usuario: ", error);
  }
}

module.exports = {
  createMikrotikConnection,
  getHotspotProfUsers,
  createUserHotspot,
};
