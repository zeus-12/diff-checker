interface WordDiff {
  type: "add" | "remove" | "same";
  content: string;
}

interface DiffLine {
  type: "add" | "remove" | "same";
  content: string;
  wordDiffs?: WordDiff[];
}

interface DiffViewerProps {
  diff: DiffLine[];
}

function DiffContent({ line }: { line: DiffLine }) {
  if (!line.wordDiffs) {
    return <span>{line.content}</span>;
  }

  return (
    <span>
      {line.wordDiffs.map((word, i) => (
        <span
          key={i}
          className={
            word.type === "add"
              ? "bg-[#23863626] text-[#2ea043]"
              : word.type === "remove"
              ? "bg-[#ff000026] text-[#ff0000]"
              : ""
          }
        >
          {word.content}
        </span>
      ))}
    </span>
  );
}

export function DiffViewer({ diff }: DiffViewerProps) {
  return (
    <div className="mt-6 border border-[#30363d] rounded-lg overflow-hidden">
      <div className="grid grid-cols-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="p-3 text-sm font-medium text-gray-300 text-center border-r border-[#30363d]">
          Original File
        </div>
        <div className="p-3 text-sm font-medium text-gray-300 text-center">
          Modified File
        </div>
      </div>

      <div className="grid grid-cols-2 text-sm font-mono">
        <div className="border-r border-[#30363d]">
          {diff.map((line, i) => (
            <div
              key={`left-${i}`}
              className={`px-4 py-1 ${
                line.type === "remove" ? "bg-[#ff000015]" : ""
              }`}
            >
              {line.type !== "add" && <DiffContent line={line} />}
            </div>
          ))}
        </div>
        <div>
          {diff.map((line, i) => (
            <div
              key={`right-${i}`}
              className={`px-4 py-1 ${
                line.type === "add" ? "bg-[#00ff0015]" : ""
              }`}
            >
              {line.type !== "remove" && <DiffContent line={line} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
