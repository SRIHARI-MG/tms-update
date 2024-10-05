import { useState, KeyboardEvent } from "react";
import { PlusIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  initialTags?: string[];
  maxTags?: number;
  onTagsChange?: (tags: string[]) => void;
}

export default function TagInput({
  initialTags = [],
  maxTags = Infinity,
  onTagsChange,
}: TagInputProps = {}) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    if (tag.trim() !== "" && !tags.includes(tag) && tags.length < maxTags) {
      const newTags = [...tags, tag.trim()];
      setTags(newTags);
      onTagsChange?.(newTags);
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onTagsChange?.(newTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm"
          >
            {tag}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-primary-foreground hover:text-primary"
              onClick={() => removeTag(index)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove tag</span>
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            tags.length < maxTags ? "Add a tag..." : "Tag limit reached"
          }
          disabled={tags.length >= maxTags}
          className="flex-grow"
        />
        <Button
          onClick={() => addTag(inputValue)}
          disabled={inputValue.trim() === "" || tags.length >= maxTags}
          className="ml-2"
        >
          <PlusIcon className="h-4 w-4" /> Add
        </Button>
      </div>

      {maxTags !== Infinity ? (
        <p className="text-sm text-muted-foreground mt-2">
          {tags.length} / {maxTags} tags used
        </p>
      ) : (
        <p className="text-sm text-muted-foreground mt-2">
          {tags.length} skills are added
        </p>
      )}
    </div>
  );
}
