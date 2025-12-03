import TextRecognition from "@react-native-ml-kit/text-recognition";

const USSD_CODE_PATTERN = /^\d{14}$/;

/**
 * Extract 14-digit USSD code from image using ML Kit text recognition
 */
export async function extractUSSDCodeFromImage(
  photoUri: string
): Promise<string | null> {
  try {
    const result = await TextRecognition.recognize(photoUri);
    console.log("Text recognition result:", result);
    const codeBlock = result.blocks.find((block) =>
      block.text.replace(/\s/g, "").match(USSD_CODE_PATTERN)
    );
    return codeBlock ? codeBlock.text.replace(/\s+/g, "") : null;
  } catch (error) {
    console.error("Error during text recognition:", error);
    throw error;
  }
}
