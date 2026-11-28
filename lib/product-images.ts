import { createClient } from "@/lib/supabase/client";

const BUCKET = "product-images";

export async function uploadProductImage(file: File) {
  const supabase = createClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filePath = `${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage.from(BUCKET).upload(filePath, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return publicUrl.publicUrl;
}
