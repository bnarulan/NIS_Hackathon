// authController.js placeholder
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prismaClient.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config.js";

const SALT_ROUNDS = 10;

export async function register(req, res, next) {
  try {
    const { iin, password, role } = req.body;

    if (!iin || !password) {
      return res.status(400).json({ error: "IIN and password are required" });
    }

    if (!["RESIDENT", "CONTRACTOR", "CONTROLLER"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existing = await prisma.user.findUnique({ where: { iin } });
    if (existing) {
      return res.status(409).json({ error: "User with this IIN already exists" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { iin, passwordHash, role }
    });

    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    res.status(201).json({
      token,
      user: { id: user.id, role: user.role }
    });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { iin, password } = req.body;

    const user = await prisma.user.findUnique({ where: { iin } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    res.json({
      token,
      user: { id: user.id, role: user.role }
    });
  } catch (e) {
    next(e);
  }
}