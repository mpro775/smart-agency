import type { BlogContentType } from "../../admin/types";
import { contentTypeLabels } from "./blogUtils";

export default function ContentTypeBadge({ type }: { type?: BlogContentType }) {
  const value = type || "article";

  return (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
      {contentTypeLabels[value]}
    </span>
  );
}
