const WebStoryPreview = ({ page }) => {
  return (
    <div className="border p-4 rounded">
      <h2 className="text-2xl font-bold">{page.title}</h2>
      <p>{page.content}</p>
    </div>
  );
};

export default WebStoryPreview;
