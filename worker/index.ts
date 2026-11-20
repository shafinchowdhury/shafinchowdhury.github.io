// Cloudflare Worker: serves the static site and runs Sudoku team rooms.
// Each room is one Durable Object holding the true board; players connect over WebSocket.
import { DurableObject } from "cloudflare:workers";
import { DIFFICULTIES, type Difficulty } from "../src/sudoku/engine.ts";
import {
  hint,
  join,
  newRoom,
  place,
  restart,
  type RoomState,
  view,
} from "../src/sudoku/room.ts";

const IDLE_TTL = 24 * 60 * 60 * 1000; // rooms delete themselves after a day of no moves
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I/L mix-ups
const CODE_RE = /^[A-HJKMNP-Z2-9]{6}$/;

const isDifficulty = (d: unknown): d is Difficulty =>
  DIFFICULTIES.includes(d as Difficulty);
const isIndex = (i: unknown): i is number =>
  Number.isInteger(i) && (i as number) >= 0 && (i as number) < 81;

type Attachment = { id: string };

export class Room extends DurableObject<Env> {
  private state: RoomState | null | undefined;

  private async load() {
    this.state ??= (await this.ctx.storage.get<RoomState>("s")) ?? null;
    return this.state;
  }

  private async save() {
    await this.ctx.storage.put("s", this.state);
    await this.ctx.storage.setAlarm(Date.now() + IDLE_TTL);
  }

  /** Called once by the Worker; false if the code is already taken. */
  async create(difficulty: Difficulty) {
    if (await this.load()) return false;
    this.state = newRoom(difficulty, Date.now());
    await this.save();
    return true;
  }

  async fetch(req: Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id") ?? "";
    const name = url.searchParams.get("name") ?? "";
    const [client, server] = Object.values(new WebSocketPair());
    const s = await this.load();
    const error = !s
      ? "Room not found. Check the code, or create a new team."
      : !/^[\w-]{8,64}$/.test(id)
        ? "Invalid player id."
        : join(s, id, name);
    if (error) {
      server.accept();
      server.send(JSON.stringify({ t: "error", msg: error }));
      server.close(4000, "rejected");
    } else {
      this.ctx.acceptWebSocket(server);
      server.serializeAttachment({ id } satisfies Attachment);
      await this.save();
      this.broadcast({ k: "join", by: id });
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, raw: string | ArrayBuffer) {
    const s = await this.load();
    if (!s || typeof raw !== "string" || raw.length > 200) return;
    let msg: { t?: unknown; i?: unknown; v?: unknown; d?: unknown };
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }
    const { id } = ws.deserializeAttachment() as Attachment;
    const now = Date.now();

    if (
      msg.t === "place" &&
      isIndex(msg.i) &&
      isIndex(msg.v) &&
      msg.v > 0 &&
      msg.v <= 9
    ) {
      const r = place(s, id, msg.i, msg.v, now);
      if (!r) return;
      if (r === "wrong")
        ws.send(JSON.stringify({ t: "wrong", i: msg.i, v: msg.v }));
      await this.save();
      this.broadcast({
        k: s.status !== "playing" ? s.status : r === "ok" ? "place" : "lost",
        by: id,
        i: msg.i,
      });
    } else if (msg.t === "hint" && isIndex(msg.i)) {
      const i = hint(s, id, msg.i, now);
      if (i === null) return;
      await this.save();
      this.broadcast({
        k: s.status === "solved" ? "solved" : "hint",
        by: id,
        i,
      });
    } else if (
      msg.t === "restart" &&
      (msg.d === undefined || isDifficulty(msg.d))
    ) {
      restart(s, now, msg.d);
      await this.save();
      this.broadcast({ k: "restart", by: id });
    }
  }

  async webSocketClose(ws: WebSocket) {
    const { id } = ws.deserializeAttachment() as Attachment;
    this.broadcast({ k: "leave", by: id }, ws);
  }

  async alarm() {
    await this.ctx.storage.deleteAll();
    this.state = null;
  }

  /** Sends the whole public room state to everyone; it's small, so no diffing. */
  private broadcast(
    ev: { k: string; by: string; i?: number },
    closing?: WebSocket
  ) {
    const sockets = this.ctx.getWebSockets().filter(w => w !== closing);
    const online = [
      ...new Set(
        sockets.map(w => (w.deserializeAttachment() as Attachment).id)
      ),
    ];
    const msg = JSON.stringify({
      t: "state",
      s: view(this.state!, online, Date.now()),
      ev,
    });
    for (const w of sockets)
      try {
        w.send(msg);
      } catch {
        // Socket already gone; its close handler will update the others.
      }
  }
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const roomFor = (code: string) => env.ROOMS.get(env.ROOMS.idFromName(code));

    if (url.pathname === "/api/sudoku/rooms" && req.method === "POST") {
      const { difficulty } = await req
        .json<{ difficulty?: unknown }>()
        .catch(() => ({ difficulty: undefined }));
      if (!isDifficulty(difficulty))
        return Response.json({ error: "Pick a difficulty." }, { status: 400 });
      for (let tries = 0; tries < 5; tries++) {
        const code = [...crypto.getRandomValues(new Uint8Array(6))]
          .map(b => CODE_CHARS[b % CODE_CHARS.length])
          .join("");
        if (await roomFor(code).create(difficulty))
          return Response.json({ code });
      }
      return Response.json(
        { error: "Couldn't make a room. Try again." },
        { status: 503 }
      );
    }

    const ws = url.pathname.match(/^\/api\/sudoku\/rooms\/([^/]+)\/ws$/);
    if (ws) {
      const code = ws[1].toUpperCase();
      if (req.headers.get("Upgrade") !== "websocket" || !CODE_RE.test(code))
        return new Response("Expected a WebSocket to a valid room code.", {
          status: 400,
        });
      return roomFor(code).fetch(req);
    }

    if (url.pathname.startsWith("/api/"))
      return new Response("Not found", { status: 404 });
    return env.ASSETS.fetch(req);
  },
} satisfies ExportedHandler<Env>;
