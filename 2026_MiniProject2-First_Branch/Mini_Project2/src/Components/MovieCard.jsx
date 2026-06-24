import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const truncateText = (text, maxLength) => {
  if (!text) return "";
  const cleaned = text.replace(/<[^>]*>/g, "");
  return cleaned.length > maxLength
    ? `${cleaned.slice(0, maxLength).trim()}...`
    : cleaned;
};

export default function MovieCard({
  title,
  description,
  imageUrl,
  onMoreDetails,
  putInWatchList,
  isInWatchList = false,
}) {
  const cleanDescription = truncateText(description, 100);

  return (
    <Card style={{ width: "18rem", minHeight: "26rem" }}>
      <Card.Img variant="top" src={imageUrl} />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{title}</Card.Title>
        <Card.Text className="flex-grow-1">{cleanDescription}</Card.Text>
        <Button variant="outline-primary" onClick={onMoreDetails}>
          More Details
        </Button>

        <Button
          variant={isInWatchList ? "secondary" : "outline-success"}
          className="mt-2"
          onClick={putInWatchList}
        >
          {isInWatchList ? "Currently Watching" : "Add to Watchlist"}
        </Button>
      </Card.Body>
    </Card>
  );
}
