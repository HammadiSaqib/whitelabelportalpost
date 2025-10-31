import AccessControlledRoute from "@/components/AccessControlledRoute";
import CategoryManager from "./CategoryManager";

export default function CategoriesPage() {
  return (
    <AccessControlledRoute 
      feature="categories" 
      featureName="Categories Management"
      description="Create and organize product categories to better structure your content and make it easier for customers to find what they need."
    >
      <CategoryManager />
    </AccessControlledRoute>
  );
}