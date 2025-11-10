import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

export const WORKFLOW_ID =
  process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

export const N8N_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL?.trim() ?? "";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "How does Solum automate my practice?",
    prompt: "How does Solum Health automate administrative tasks for my therapy practice?",
    icon: "sparkle",
  },
  {
    label: "Does Solum integrate with my EHR?",
    prompt: "Does Solum Health integrate with my existing EHR system?",
    icon: "circle-question",
  },
  {
    label: "How does Solum handle Verification of Benefits?",
    prompt: "How does Solum Health handle Verification of Benefits?",
    icon: "check-circle",
  },
];

export const PLACEHOLDER_INPUT = "Ask about Solum Health...";

export const GREETING = "Welcome to Solum Health! How can I help you today?";

export const getThemeConfig = (theme: ColorScheme): ThemeOption => ({
  color: {
    grayscale: {
      hue: 220,
      tint: 6,
      shade: theme === "dark" ? -1 : -4,
    },
    accent: {
      primary: theme === "dark" ? "#f1f5f9" : "#0f172a",
      level: 1,
    },
  },
  radius: "round",
  // Add other theme options here
  // chatkit.studio/playground to explore config options
});
