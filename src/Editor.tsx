import React, { useState, useEffect, useRef } from "react";

const PAGE_HEIGHT = 1123; // A4 height in pixels (297mm ≈ 1123px)

const Editor = ({ index, pageContent, pages, setPages }) => {
  const [currentIndex, setCurrentIndex] = useState(pages.length - 1);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = (index) => {
    if (!editorRef.current) return;

    const content = editorRef.current.innerHTML;
    const newPages = [...pages];
    console.log("Creating new Pages but not updating");
    console.log(newPages);
    newPages[index] = content;
    console.log(newPages);

    // Check if content overflows the current page
    if (editorRef.current.scrollHeight > PAGE_HEIGHT) {
      // Get all content nodes
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

      newPages[0] = firstPageContent;
      console.log("Pages Length: ", newPages.length);
      newPages.splice(index + 1, 0, "");
      console.log("Index: ", index);
      console.log("Current Index: ", currentIndex);
      console.log("Pages Length after updating: ", newPages.length);
      setPages(newPages);
      console.log("       =======     ")
      console.log("Index: ", index);
      console.log("Current Index: ", currentIndex);
      
    } else {
      setPages(newPages);
    }
  };

  // useEffect(() => {
  //   // Automatically focus on the editor when it becomes the current page
  //   if (index === currentIndex && editorRef.current) {
  //     console.log("Focus on page ");
  //     console.log(currentIndex + 1);
  //     editorRef.current.focus();
  //   }
  // }, [currentIndex, index]);

  return (
    <div
      key={index}
      className="relative gap-2 shadow-lg rounded-lg overflow-hidden"
    >
      <h1 className="absolute p-2">{index + 1}</h1>
      <div
        onClick={() => {
          if (index !== currentIndex) {
            console.log("Clicked", index);
            setCurrentIndex(index);
          }
        }}
        ref={index === currentIndex ? editorRef : null}
        contentEditable={index === currentIndex}
        onInput={
          index === currentIndex
            ? () => {
                handleInput(currentIndex);
              }
            : undefined
        }
        className="w-[210mm] mx-auto outline-none bg-white overflow-hidden "
        style={{
          height: `${PAGE_HEIGHT}px`,
          padding: "20mm",

          overflowY: "hidden",
          boxSizing: "border-box",
        }}
        dangerouslySetInnerHTML={{
          __html: index !== currentIndex ? pageContent : undefined,
        }}
      />
    </div>
  );
};

const EditorStack = ({ pages, setPages }) => {
  return (
    <div className="flex flex-col gap-4 ">
      {pages.map((pageContent, index) => (
        <Editor
          key={index}
          index={index}
          pageContent={pageContent}
          pages={pages}
          setPages={setPages}
        />
      ))}
    </div>
  );
};

export default EditorStack;
