import { LoaderCircle } from "lucide-react"

export const Loading = () => (
  <>
    <div className="flex size-full items-center justify-center">
      <LoaderCircle className="w-4 h-4 mr-1 animate-spin" />
      読み込み中
    </div>
  </>
);
