import { NextResponse } from 'next/server';

import { getCategoryTree } from '~/client/queries/get-category-tree';

type Category = {
  entityId: number;
  name: string;
  path: string;
}

type CategoryWithChildren = Category & { children: CategoryWithChildren[] }

const flattenCategoryTree = (categories: CategoryWithChildren[]) => {
  return categories.reduce<Category[]>((acc, category) => {
    acc.push(category);
    if (category.children?.length) {
      acc.push(...flattenCategoryTree(category.children));
    }
    return acc;
  }, []);
}

export const GET = async () => {
  const searchResults = await getCategoryTree();

  const categories = flattenCategoryTree(searchResults);

  return NextResponse.json({ categories });
};

export const runtime = 'edge';
