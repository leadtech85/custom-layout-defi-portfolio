import React from "react";
import DOMPurify from "dompurify";

const EmbeddedWidget = () => {
  // Sanitize the URL using DOMPurify to prevent XSS attacks
  const url = "https://science-miner.com/blog/";
  const sanitizedUrl = DOMPurify.sanitize(url);

  return (
    <div>
      <h2>Embedded Page</h2>
      <iframe
        src={sanitizedUrl}
        title="Embedded Page"
        className="h-[40rem] w-full"
      ></iframe>
    </div>
  );
};

export default EmbeddedWidget;
