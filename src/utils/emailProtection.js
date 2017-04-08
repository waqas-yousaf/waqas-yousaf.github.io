const USER_CODES = [119, 97, 113, 97, 115];
const DOMAIN_CODES = [119, 105, 115, 104, 100, 100, 46, 99, 111, 109];

function decodeCodes(codes) {
  return String.fromCharCode(...codes);
}

export function getProtectedEmail() {
  return `${decodeCodes(USER_CODES)}@${decodeCodes(DOMAIN_CODES)}`;
}

export function openProtectedEmail() {
  const address = getProtectedEmail();
  window.location.href = `mailto:${address}`;
}

export async function copyProtectedEmail() {
  const address = getProtectedEmail();
  await navigator.clipboard.writeText(address);
  return address;
}
