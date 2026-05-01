export default function Message({ text }) {
  if (!text) return null;
  return <pre>{text}</pre>;
}