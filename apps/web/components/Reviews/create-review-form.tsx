"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code,
} from "lucide-react";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border-b p-2 flex flex-wrap gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-yellow-600" : ""}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-yellow-600" : ""}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "bg-yellow-600" : ""}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "bg-yellow-600" : ""}
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={setLink}
        className={editor.isActive("link") ? "bg-yellow-600" : ""}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={addImage}>
        <ImageIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-yellow-600" : ""}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-yellow-600" : ""}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "bg-yellow-600" : ""}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface CreateReviewFormProps {
  onSubmit: (data: { content: string; visibility: string }) => void;
}

export function CreateReviewForm({ onSubmit }: CreateReviewFormProps) {
  const { handleSubmit, reset } = useForm();
  const [selectedTitleId, setSelectedTitleId] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Write your review...",
      }),
      Underline,
      TextStyle,
      Color,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none",
      },
    },
  });

  const { data: titles } = useQuery({
    queryKey: ["titles"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/titles");
      return data;
    },
  });

  const onSubmitForm = (data) => {
    if (!editor) return;

    onSubmit({
      ...data,
      titleId: selectedTitleId,
      content: editor.getHTML(),
      visibility,
    });

    reset();
    setSelectedTitleId("");
    editor.commands.setContent("");
  };

  return (
    <Card className="backdrop-blur-md dark:bg-white/5 bg-black/5 border-none">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <Select
            value={selectedTitleId}
            onValueChange={(value) => setSelectedTitleId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a movie/show to review" />
            </SelectTrigger>
            <SelectContent>
              {titles?.data?.map((title) => (
                <SelectItem key={title.id} value={title.id}>
                  {title.primaryTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="border rounded-md overflow-hidden">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="prose-editor" />
          </div>

          <div className="flex justify-between items-center">
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="FRIENDS">Friends Only</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="submit"
              disabled={!selectedTitleId || !editor?.getText().trim()}
              className="w-full"
            >
              Post Review
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
