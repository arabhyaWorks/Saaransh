import React, { useState, useRef, useEffect } from "react";
import { Bold, Italic, Download, Type } from "lucide-react";
import Editor from "./Editor";
import EditorStack from "./Editor";

function App() {
  const [pages, setPages] = useState<string[]>([""]);

  const PAGE_HEIGHT = 1123; // A4 height in pixels (297mm ≈ 1123px)

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleExport = () => {
    const content = pages.join(
      " =================                \n\n\n\n\n\n                    ================= "
    );

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { background: #f0f0f0; margin: 0; font-family: Arial; }
            .page { break-after: page; box-sizing: border-box; }
            @media print { 
              .page { margin: 0; box-shadow: none; }
              @page { size: A4; margin: 20mm; }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `;

    console.log(content);
  };

  useEffect(() => {
    // console.log(pages);
  }, [pages]);

  return (
    <div className="min-h-screen flex  bg-gray-100">
      <div className="bg-red-400 h-[100vh] overflow-scroll max-w-[210mm] mx-auto p-4">
        {/* Toolbar */}
        <div className="bg-white shadow-sm mb-4 p-2 rounded-lg flex gap-2 sticky top-0 z-10">
          <button
            onClick={() => handleFormat("bold")}
            className="p-2 hover:bg-gray-100 rounded"
            title="Bold"
          >
            <Bold size={20} />
          </button>
          <button
            onClick={() => handleFormat("italic")}
            className="p-2 hover:bg-gray-100 rounded"
            title="Italic"
          >
            <Italic size={20} />
          </button>
          <select
            onChange={(e) => handleFormat("fontSize", e.target.value)}
            className="border rounded px-2"
          >
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select>
          <select
            onChange={(e) => handleFormat("fontName", e.target.value)}
            className="border rounded px-2"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
          <button
            onClick={handleExport}
            className="ml-auto p-2 bg-blue-500 text-white rounded flex items-center gap-2 hover:bg-blue-600"
          >
            <Download size={20} /> Export
          </button>
        </div>

        {/* Stacked Pages */}

        <EditorStack pages={pages} setPages={setPages}  />
        
      </div>

      <div
        className="bg-green-400 p-4 overflow-y-scroll"
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {pages.map((pageContent, index) => (
          <div
            key={index}
            className="page-container mb-8"
            style={{
              // width: "105mm", // Scaled-down width (50%)
              width: (105 / 2).toString() + "mm",
              // height: "148.5mm", // Scaled-down height (50%)
              height: (148.5 / 2).toString() + "mm",
              background: "green", // Background to see the container
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)", // Optional shadow for better visibility
            }}
          >
            <div
              style={{
                transform: "scale(0.25)", // Scale down to 50%
                transformOrigin: "top left", // Align scaling to top-left
                width: (105 / 2).toString() + "mm",
                height: (148.5 / 2).toString() + "mm",
              }}
            >
              <div
                className="page"
                style={{
                  width: "210mm",
                  height: "297mm",
                  padding: "20mm",
                  background: "white",
                  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                }}
                dangerouslySetInnerHTML={{ __html: pageContent }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
