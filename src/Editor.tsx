import React, { useState, useEffect } from "react";
import { Bold, Italic, Download, Type } from "lucide-react";

const PAGE_HEIGHT = 1123; // A4 height in pixels (297mm ≈ 1123px)

const Editor = ({ index, pageContent, pages, editorRef, handleInput }) => {
  const [pageClicked, setPageClicked] = useState(false);
  const [pageClickedIndex, setPageClickedIndex] = useState(pages.length - 1);

  const isContentEditable = () => {
    if (pageClicked) {
      return true;
    } else {
      return index === pages.length - 1;
    }
  };

  const currentRef = () => {
    if (pageClicked) {
      index === pageClickedIndex ? editorRef : null;
    } else {
      index === pages.length - 1 ? editorRef : null;
    }
  };
  //   useEffect(() => {
  //     if (index === pages.length - 1) {
  //       editorRef.current.focus();
  //     }
  //   } , [index, pages.length, editorRef]);

  return (
    <div
      key={index}
      className="relative gap-2 shadow-lg rounded-lg overflow-hidden"
    >
      <h1 className="absolute p-2">{index + 1}</h1>
      <div
        onClick={() => {
          if (index !== pages.length - 1) {
            console.log("Clicked", index);
            setPageClicked(true);
            setPageClickedIndex(index);

            editorRef.current.focus();
          }
        }}
        ref={currentRef()}
        // ref={index === pages.length - 1 ? editorRef : null}
        contentEditable={isContentEditable()}
        onInput={
          index === pages.length - 1
            ? () => {
                handleInput(pages.length - 1);
              }
            : undefined
        }
        className="w-[210mm] mx-auto outline-none bg-green-200 overflow-hidden "
        style={{
          height: `${PAGE_HEIGHT}px`,
          padding: "20mm",

          overflowY: "hidden",
          boxSizing: "border-box",
        }}
        dangerouslySetInnerHTML={{
          __html: index !== pages.length - 1 ? pageContent : undefined,
        }}
      />
    </div>
  );
};

export default Editor;
