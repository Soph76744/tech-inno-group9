// UI display on creation of tool whether successful interaction or not
export default function Message({ text }) {
  if (!text) return null;
  return <pre>{text}</pre>;
}