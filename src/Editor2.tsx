import React, { useState, useEffect, useRef } from "react";

const PAGE_HEIGHT = 1123; // A4 height in pixels (297mm ≈ 1123px)

const Editor = ({
  index,
  pageContent,
  pages,
  setPages,
//   currentIndex,
//   setCurrentIndex,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current page being edited


  const handleInput = () => {
    if (!editorRef.current) return;

    const content = editorRef.current.innerHTML;
    const newPages = [...pages];
    newPages[index] = content;

    // Check if content overflows the current page
    if (editorRef.current.scrollHeight > PAGE_HEIGHT) {
      const nodes = Array.from(editorRef.current.childNodes);
      let currentHeight = 0;
      let splitIndex = nodes.length;

      // Find the node that causes overflow
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const nodeHeight =
          (node as HTMLElement).offsetHeight || node.textContent?.length || 0;

        if (currentHeight + nodeHeight > PAGE_HEIGHT) {
          splitIndex = i;
          break;
        }
        currentHeight += nodeHeight;
      }

      // Split content between pages
      const firstPageContent = nodes
        .slice(0, splitIndex)
        .map((node) =>
          node instanceof HTMLElement ? node.outerHTML : node.textContent
        )
        .join("");

      const secondPageContent = nodes
        .slice(splitIndex)
        .map((node) =>
          node instanceof HTMLElement ? node.outerHTML : node.textContent
        )
        .join("");

      // Update the current page content
      newPages[index] = firstPageContent;

      // Insert a new page with the overflow content
      newPages.splice(index + 1, 0, secondPageContent);

      setPages(newPages);

      // Focus on the newly inserted page
      if (index <= currentIndex) {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      setPages(newPages);
    }
  };

  useEffect(() => {
    // Automatically focus on the editor when it becomes the current page
    if (index === currentIndex && editorRef.current) {
      editorRef.current.focus();
    }
  }, [currentIndex, index]);

  return (
    <div className="relative gap-2 shadow-lg rounded-lg overflow-hidden">
      <h1 className="absolute p-2">{index + 1}</h1>
      <div
        ref={index === currentIndex ? editorRef : null}
        contentEditable={index === currentIndex}
        onInput={() => handleInput()}
        className="w-[210mm] mx-auto outline-none bg-white overflow-hidden "
        style={{
          height: `${PAGE_HEIGHT}px`,
          padding: "20mm",
          overflowY: "hidden",
          boxSizing: "border-box",
        }}
        // dangerouslySetInnerHTML={{
        //   __html: pageContent,
        // }}
      />
    </div>
  );
};

const EditorStack = ({ pages, setPages }) => {

  return (
    <div className="flex flex-col gap-4">
      {pages.map((pageContent, index) => (
        <Editor
          key={index}
          index={index}
          pageContent={pageContent}
          pages={pages}
          setPages={setPages}
        //   currentIndex={currentIndex}
        //   setCurrentIndex={setCurrentIndex}
        />
      ))}
    </div>
  );
};

export default EditorStack;
