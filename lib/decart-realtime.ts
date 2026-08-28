import { createDecartClient, models } from "@decartai/sdk";

export async function connectDecart(
  stream: MediaStream,
  onRemoteStream: (stream: MediaStream) => void
) {
  const response = await fetch("/api/vton/session", {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok || !data.success || !data.apiKey) {
    throw new Error(data.error || "Failed to get Decart token");
  }

  const client = createDecartClient({
    apiKey: data.apiKey,
  });

  const realtime = await client.realtime.connect(stream, {
    model: models.realtime("lucy-vton-latest"),
    mirror: "auto",
    onRemoteStream,
  });

  return realtime;
}

export async function applyGarment(
  realtime: Awaited<ReturnType<typeof connectDecart>>,
  imageUrl: string,
  garmentName: string
) {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error("Failed to load garment image");
  }

  const garmentBlob = await response.blob();

  await realtime.setImage(garmentBlob, {
    prompt: `Put the ${garmentName} on the person. Preserve the person's body, face, pose, and background.`,
    enhance: false,
  });
}   
export function disconnectDecart(
    realtime: Awaited<ReturnType<typeof connectDecart>> | null
  ) {
    if (!realtime) return;
  
    realtime.disconnect();
  }