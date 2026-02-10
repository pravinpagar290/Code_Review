const fs = require("fs").promises;
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "..", "data");
const FILE = path.join(DATA_DIR, "resumes.json");

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(FILE);
    } catch (e) {
      await fs.writeFile(FILE, JSON.stringify({}), "utf8");
    }
  } catch (err) {
    console.error("ensureDataFile error", err);
    throw err;
  }
}

async function readAll() {
  await ensureDataFile();
  const raw = await fs.readFile(FILE, "utf8");
  return JSON.parse(raw || "{}");
}

async function writeAll(data) {
  await ensureDataFile();
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
}

function genId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  try {
    return require("crypto").randomUUID();
  } catch (e) {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }
}

async function createResume(payload) {
  const id = genId();
  const all = await readAll();
  all[id] = {
    id,
    createdAt: new Date().toISOString(),
    data: payload,
  };
  await writeAll(all);
  return id;
}

async function getResume(id) {
  const all = await readAll();
  return all[id] || null;
}

module.exports = {
  createResume,
  getResume,
};
