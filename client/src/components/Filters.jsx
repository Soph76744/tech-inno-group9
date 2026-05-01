export default function Filters({ onFilter }) {
  return (
    <div className="row">
      <button onClick={() => onFilter(null)}>All</button>
      <button onClick={() => onFilter("available")}>Available</button>
      <button onClick={() => onFilter("in-use")}>In Use</button>
      <button onClick={() => onFilter("missing")}>Missing</button>
    </div>
  );
}