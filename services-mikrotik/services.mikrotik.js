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
    const result = await client.menu("/ip hotspot user profile").get();
    await conn.close();
    return result;
  } catch (error) {
    throw new Error(
      "ocurrio un error al buscar los perfiles de usuarios: ",
      error
    );
  }
}

async function getServerHotspot(req) {
  try {
    const conn = await createMikrotikConnection(req);
    const client = await conn.connect();
    const result = await client.menu("/ip hotspot").get();
    await conn.close();
    return result;
  } catch (error) {
    throw new Error(
      "ocurrio un error al buscar los servidores de hotspot: ",
      error
    );
  }
}

async function createUserHotspot(req, server, profile, user, name, password) {
  try {
    const conn = await createMikrotikConnection(req);
    const client = await conn.connect();
    if (!client) {
      throw new Error("No se pudo conectar al cliente de MikroTik");
    }
    const queryUser = client.menu("/ip hotspot user");
    const result = await queryUser.add({
      server,
      profile,
      password,
      name: user,
      comment: name,
    });
    return result;
  } catch (error) {
    throw new Error("ocurrio un error al añadir un usuario: ", error);
  }
}

async function getUserById(req, username) {
  try {
    const conn = await createMikrotikConnection(req);
    const client = await conn.connect();
    const user = await client.menu("/ip hotspot user").find({ name: username });
    await conn.close();
    return user;
  } catch (error) {
    console.error(
      `Ocurrió un error al buscar el usuario: ${username}`,error
    );
  }
}

module.exports = {
  createMikrotikConnection,
  getHotspotProfUsers,
  createUserHotspot,
  getServerHotspot,
  getUserById,
};
