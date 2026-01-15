import type { DataSerializer } from "./types";

export class JsonDataSerializer implements DataSerializer {
  serialize(data: string | object): string {
    if (typeof data === "string") {
      return JSON.stringify({ __type: "string", __value: data });
    }
    return JSON.stringify({ __type: "object", __value: data });
  }

  deserialize(data: string): string | object {
    const parsed = JSON.parse(data);
    if (parsed.__type === "string") {
      return parsed.__value as string;
    }
    return parsed.__value as object;
  }
}