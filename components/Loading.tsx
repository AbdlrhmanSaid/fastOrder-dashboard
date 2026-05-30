import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex justify-center p-10">
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default Loading;
