import * as Clipboard from "expo-clipboard";
import { dialUSSD } from "./ussdService";

export type OperatorType = "yas" | "orange" | "airtel";

interface OperatorConfig {
  format: (code: string) => string;
  onCodeExtracted: (
    code: string,
    formattedCode: string
  ) => Promise<{ dialCode: string }>;
}

const operatorConfigs: Record<OperatorType, OperatorConfig> = {
  yas: {
    format: (code) => `#321*${code}#`,
    onCodeExtracted: async (code, formattedCode) => {
      await Clipboard.setStringAsync(formattedCode);
      await dialUSSD(formattedCode);
      return { dialCode: formattedCode };
    },
  },
  orange: {
    format: (code) => `202${code}`,
    onCodeExtracted: async (code, formattedCode) => {
      await Clipboard.setStringAsync(formattedCode);
      await dialUSSD(formattedCode);
      return { dialCode: formattedCode };
    },
  },
  airtel: {
    format: (code) => `*888*${code}#`,
    onCodeExtracted: async (code, formattedCode) => {
      await Clipboard.setStringAsync(formattedCode);
      await dialUSSD(formattedCode);
      return { dialCode: formattedCode };
    },
  },
};

export async function processUSSDCode(
  operator: OperatorType,
  extractedCode: string
): Promise<{ dialCode: string; success: boolean; message?: string }> {
  try {
    const config = operatorConfigs[operator];
    if (!config) {
      return {
        dialCode: "",
        success: false,
        message: "Unknown operator",
      };
    }

    const formattedCode = config.format(extractedCode);
    const result = await config.onCodeExtracted(extractedCode, formattedCode);

    return {
      dialCode: result.dialCode,
      success: true,
    };
  } catch (error) {
    console.error(`Error processing ${operator} code:`, error);
    return {
      dialCode: "",
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function getOperatorImageName(operator: OperatorType): string {
  return operator;
}
