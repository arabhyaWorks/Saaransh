import React, { useState, useEffect, useRef } from "react";

const PAGE_HEIGHT = 1123; // A4 height in pixels (297mm ≈ 1123px)

const Editor = ({
  index,
  pageContent,
  pages,
  setPages,
  pageRefs,
  setPageRefs,
  currentIndex,
  setCurrentIndex,
}) => {
  const [cursorPosition, setCursorPosition] = useState(0);

  const handleInput = (index: number) => {
    console.log("Input on page ", index + 1);
    const currentRef = pageRefs[index];
    if (!currentRef?.current) return;

    const content = currentRef.current.innerHTML;
    const newPages = [...pages];
    newPages[index] = content;

    if (currentRef.current.scrollHeight > PAGE_HEIGHT) {
      const nodes = Array.from(currentRef.current.childNodes);
      let currentHeight = 0;
      let splitIndex = nodes.length;

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

      newPages[index] = firstPageContent;
      currentRef.current.innerHTML = firstPageContent;

      newPages.splice(index + 1, 0, secondPageContent);
      const newPageRefs = [...pageRefs, React.createRef<HTMLDivElement>()];

      setPages(newPages);
      setPageRefs(newPageRefs);

      if (pageRefs[index + 1]?.current) {
        pageRefs[index + 1].current.innerHTML = secondPageContent;
      }

      if (index <= currentIndex) {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      setPages(newPages);
    }
  };

  // const onHandleInput = (data, index) => {
  //   console.log(data.nativeEvent.data);
  //   console.log(data.nativeEvent.data?.length); // Add a null check here

  //   const updatedCursorPosition = cursorPosition + (data.nativeEvent.data?.length || 0);

  //   handleInput(index);

  //   setTimeout(() => {
  //     const selection = window.getSelection();
  //     if (selection.rangeCount > 0) {
  //       const range = selection.getRangeAt(0);
  //       const textNode = range.startContainer;
  //       const cursorPosition = range.startOffset + (data.nativeEvent.data?.length || 0);
  //       range.setStart(textNode, cursorPosition);
  //       range.setEnd(textNode, cursorPosition);
  //       range.collapse(true);
  //       selection.removeAllRanges();
  //       selection.addRange(range);
  //     }
  //   }, 0);
  // };

  useEffect(() => {
    if (index === currentIndex && pageRefs[currentIndex].current) {
      console.log("Focus on page ", currentIndex + 1);
      // pageRefs[currentIndex].current.innerHTML = pages[index];

      pageRefs[currentIndex].current.focus();
    }
  }, [currentIndex, index, pages]);

  return (
    <div
      key={index}
      className="relative gap-2 shadow-lg rounded-lg overflow-hidden"
    >
      <h1 className="absolute p-2">
        Page {index}, Current Index {currentIndex}, cursor Positiion{" "}
        {cursorPosition}
      </h1>
      <div
        // ref={pageRefs[index]}
        ref={index === currentIndex ? pageRefs[index] : null}
        onClick={() => {
          // if (index !== currentIndex) {
          console.log("Clicked", index);
          setCurrentIndex(index);
          // }
        }}
        // contentEditable={index === currentIndex}
        contentEditable={true}
        // dir="ltr" // Add this attribute

        onInput={
          index === currentIndex
            ? () => {
                handleInput(currentIndex);
              }
            : undefined
        }
        // onInput={(data) => {
        //   if (index === currentIndex) {
        //     onHandleInput(data, index);
        //   }
        // }}
        className="w-[210mm] mx-auto outline-none bg-white overflow-hidden"
        style={{
          height: `${PAGE_HEIGHT}px`,
          padding: "20mm",
          overflowY: "hidden",
          boxSizing: "border-box",
        }}
        // dangerouslySetInnerHTML={{
        //   // __html: index === currentIndex ? pageContent : undefined,
        //   __html: pageContent,
        // }}
      />
    </div>
  );
};

const EditorStack = ({ pages, setPages, pageRefs, setPageRefs }) => {
  const [currentIndex, setCurrentIndex] = useState(pages.length - 1);

  return (
    <div className="flex flex-col gap-4 ">
      {pages.map((pageContent, index) => (
        <Editor
          key={index}
          index={index}
          pageContent={pageContent}
          pages={pages}
          setPages={setPages}
          pageRefs={pageRefs}
          setPageRefs={setPageRefs}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      ))}
    </div>
  );
};

export default EditorStack;
