"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Category } from "@/lib/data"

type CategoryTabsProps = {
  categories: Category[];
  onCategoryChange: (categoryId: string) => void;
  selectedCategoryId: string;
};

export function CategoryTabs({ categories, onCategoryChange, selectedCategoryId }: CategoryTabsProps) {
  return (
    <div className="flex justify-center">
      <Tabs value={selectedCategoryId} onValueChange={onCategoryChange} className="w-full max-w-4xl">
        <TabsList className="grid w-full grid-cols-2 h-auto flex-wrap justify-center sm:flex sm:h-10">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex-1 sm:flex-none">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
