import { createServerFn } from "@tanstack/react-start";
import { generateImage } from "@lovable.dev/ai-gateway";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type CoverRequest = {
  title: string;
  subtitle: string;
  category: string;
  kind: "essay" | "poem";
  excerpt: string;
  body: string;
};

export const generateCoverImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: CoverRequest) => input)
  .handler(async ({ data, context }) => {
    const title = data.title.trim().slice(0, 240);
    const body = data.body.trim().slice(0, 5000);
    if (!title || !body) {
      throw new Error("Add a title and some article text before generating an image.");
    }

    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) throw new Error("Only editors can generate cover images.");

    const contextText = [
      `Title: ${title}`,
      data.subtitle.trim() ? `Subtitle: ${data.subtitle.trim().slice(0, 240)}` : "",
      `Section: ${data.category.trim().slice(0, 100)}`,
      `Format: ${data.kind === "poem" ? "poetry" : "essay or article"}`,
      data.excerpt.trim()
        ? `Summary: ${data.excerpt.trim().slice(0, 700)}`
        : `Text: ${body}`,
      data.excerpt.trim() ? `Text excerpt: ${body.slice(0, 2800)}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = [
      "Create one original editorial cover photograph/illustration for the literary work described below.",
      "Make the imagery closely reflect its actual subjects, ideas, setting, and mood; avoid generic book imagery.",
      "Sophisticated literary-journal art direction, natural detail, thoughtful composition, nuanced color, clear focal subject.",
      "Wide landscape composition suitable for a 16:9 article cover. No text, lettering, logos, borders, or watermarks.",
      "Depict sensitive religious or historical themes respectfully and avoid depicting sacred figures.",
      "Use the following work details as creative context, not as text to render:",
      contextText,
    ].join("\n\n");

    try {
      const result = await generateImage({
        model: "openai/gpt-image-2.5-sunburst",
        prompt,
        size: "1536x1024",
        quality: "high",
        output_format: "jpeg",
        output_compression: 80,
        n: 1,
      });
      const image = result.data?.[0]?.b64_json;
      if (!image) throw new Error("The image service returned no image.");
      return { imageData: `data:image/jpeg;base64,${image}` };
    } catch {
      throw new Error("Could not generate a cover image right now. Please try again.");
    }
  });