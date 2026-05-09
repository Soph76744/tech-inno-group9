import "../styles/ToolsPage.css";
// Filtering options for organising Tools: all, available, in use, missing
// Displays them as clickable buttons to toggle
export default function Filters({onFilter}) {
  return (
    <div className="row">
      <button className="filters-button" onClick={() => onFilter(null)}>All</button>
      <button className="filters-button" onClick={() => onFilter("available")}>Available</button>
      <button className="filters-button" onClick={() => onFilter("in-use")}>In Use</button>
      <button className="filters-button" onClick={() => onFilter("missing")}>Missing</button>
    </div>
  );
}