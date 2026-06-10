import { config } from "../config";
import type { UserResponse } from "../types";

const API_URL = `${config.api.url}/users`;

export async function getUserByEmail(email: string): Promise<UserResponse> {
  try {
    const response = await fetch(`${API_URL}/${email}`);

    if (!response.ok) {
      throw new Error("Error al obtener el usuario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en UserService:", error);
    throw error;
  }
}