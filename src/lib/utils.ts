import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sanitizeEmail = (email: string): string => {
  // Trim white spaces and convert to lowercase
  const sanitizedEmail = email.trim().replace(/\s/g, "").toLowerCase();

  // Validate email format
  const emailRegex =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

  if (!emailRegex.test(sanitizedEmail)) throw new Error("Invalid email format");

  return sanitizedEmail;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordBuffer = encoder.encode(password);
  const saltedPassword = new Uint8Array([...salt, ...passwordBuffer]);

  const hashBuffer = await crypto.subtle.digest("SHA-256", saltedPassword);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(
  hashedPassword: string | null | undefined,
  password: string,
): Promise<boolean> {
  if (!hashedPassword) {
    throw new Error("Invalid hashed password");
  }
  const [saltHex, hashHex] = hashedPassword?.split(":");
  if (!saltHex) {
    throw new Error("Invalid hashed password format");
  }
  const salt = new Uint8Array(
    saltHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );
  const passwordBuffer = encoder.encode(password);
  const saltedPassword = new Uint8Array([...salt, ...passwordBuffer]);

  const hashBuffer = await crypto.subtle.digest("SHA-256", saltedPassword);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHexComputed = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex === hashHexComputed;
}
