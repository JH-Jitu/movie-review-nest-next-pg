"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";

export function CreateReviewForm({ onSubmit }) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [selectedTitleId, setSelectedTitleId] = useState("");

  const { data: titles } = useQuery({
    queryKey: ["titles"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/titles");
      return data;
    },
  });

  const onSubmitForm = (data) => {
    onSubmit({
      ...data,
      titleId: selectedTitleId,
    });
    reset();
    setSelectedTitleId("");
  };

  return (
    <Card>
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

          <Textarea
            {...register("content")}
            placeholder="Write your review..."
          />

          <Button type="submit" disabled={!selectedTitleId}>
            Post Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
