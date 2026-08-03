import type { FastifyInstance } from "fastify";
import { supabaseAdmin, verifyUserToken } from "../lib/supabaseAdmin.js";

export function registerAccountRoutes(app: FastifyInstance) {
  app.post("/api/account/delete", async (request, reply) => {
    if (!supabaseAdmin) {
      return reply.status(501).send({ error: "cuenta con Google no configurada en este despliegue" });
    }

    const userId = await verifyUserToken(request.headers.authorization);
    if (!userId) {
      return reply.status(401).send({ error: "sesión inválida o expirada" });
    }

    try {
      const { error: rpcError } = await supabaseAdmin.rpc("delete_user_data", { target_user_id: userId });
      if (rpcError) throw rpcError;

      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      return reply.send({ success: true });
    } catch (err) {
      request.log.error({ err }, "account/delete failed");
      return reply.status(502).send({ error: "no se pudo eliminar la cuenta, probá de nuevo" });
    }
  });
}
