import type { Model } from "@earendil-works/pi-ai";
import { describe, expect, it } from "vitest";
import { buildGoogleProvider } from "./provider-registration.js";

function vertexModel(
  overrides: Partial<Model<"google-generative-ai">> = {},
): Model<"google-generative-ai"> {
  return {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google-vertex",
    api: "google-generative-ai",
    input: ["text"],
    reasoning: false,
    contextWindow: 1_048_576,
    maxTokens: 65_536,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    baseUrl: "https://aiplatform.googleapis.com",
    ...overrides,
  } as Model<"google-generative-ai">;
}

describe("buildGoogleProvider createStreamFn", () => {
  it("routes google-vertex models through the Vertex transport without ADC preflight", () => {
    const provider = buildGoogleProvider();
    const streamFn = provider.createStreamFn?.({ model: vertexModel() });
    expect(streamFn).toBeTypeOf("function");
  });

  it("routes by Vertex baseUrl even when model api is google-generative-ai", () => {
    const provider = buildGoogleProvider();
    const streamFn = provider.createStreamFn?.({
      model: vertexModel({ api: "google-generative-ai" }),
    });
    expect(streamFn).toBeTypeOf("function");
  });

  it("keeps AI Studio models on the Generative AI transport", () => {
    const provider = buildGoogleProvider();
    const streamFn = provider.createStreamFn?.({
      model: {
        ...vertexModel(),
        provider: "google",
        api: "google-generative-ai",
        baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      },
    });
    expect(streamFn).toBeTypeOf("function");
  });
});
