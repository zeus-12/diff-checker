import { FormEvent } from "react";

interface FileUploadProps {
  onCompare: (e: FormEvent<HTMLFormElement>) => void;
}

export function FileUpload({ onCompare }: FileUploadProps) {
  return (
    <form onSubmit={onCompare} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Original File
          </label>
          <input
            type="file"
            name="file1"
            required
            className="block w-full text-sm text-gray-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-[#238636] file:text-white
              hover:file:bg-[#2ea043]
              file:cursor-pointer cursor-pointer
              bg-[#21262d] rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Modified File
          </label>
          <input
            type="file"
            name="file2"
            required
            className="block w-full text-sm text-gray-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-[#238636] file:text-white
              hover:file:bg-[#2ea043]
              file:cursor-pointer cursor-pointer
              bg-[#21262d] rounded-md"
          />
        </div>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-[#238636] text-white rounded-md
          hover:bg-[#2ea043] transition-colors
          text-sm font-semibold"
      >
        Compare Files
      </button>
    </form>
  );
}
