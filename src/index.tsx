import { FormEvent, useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { DiffViewer } from "@/components/diff-viewer";
import { compareFiles, LineDiff } from "@/utils/diff-utils";

export default function App() {
  const [diff, setDiff] = useState<LineDiff[] | null>(null);

  const handleCompare = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file1 = formData.get("file1") as File;
    const file2 = formData.get("file2") as File;

    if (!file1 || !file2) {
      alert("Please select both files");
      return;
    }

    try {
      const [text1, text2] = await Promise.all([file1.text(), file2.text()]);

      const result = compareFiles(text1.split("\n"), text2.split("\n"));
      setDiff(result);
    } catch (error) {
      alert("Error comparing files: " + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Diff Checker</h1>
          <p className="text-gray-400">
            Compare two files and see the differences.
          </p>
        </div>

        <div className="bg-[#161b22] rounded-lg p-6 shadow-xl">
          <FileUpload onCompare={handleCompare} />
          {diff &&
            (diff.length > 0 ? (
              <DiffViewer diff={diff} />
            ) : (
              <>No changes found</>
            ))}
        </div>
      </div>
    </div>
  );
}
