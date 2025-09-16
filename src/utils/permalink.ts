/**
 * Generate a permalink URL for the collection page with usernames
 */
export function generatePermalink(usernames: string[]): string {
  if (usernames.length === 0) {
    return "/collection";
  }

  const encodedUsernames = usernames
    .map(username => encodeURIComponent(username.trim()))
    .join(",");

  return `/collection?usernames=${encodedUsernames}`;
}

/**
 * Parse usernames from URL query parameters
 */
export function parseUsernamesFromUrl(
  usernames: string | string[] | undefined
): string[] {
  if (!usernames) return [];

  const usernamesString = Array.isArray(usernames) ? usernames[0] : usernames;

  return usernamesString
    .split(",")
    .map(username => decodeURIComponent(username.trim()))
    .filter(username => username.length > 0);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand("copy");
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}
