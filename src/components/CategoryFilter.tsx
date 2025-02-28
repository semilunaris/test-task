import React, { useEffect, useState } from "react";

const CategoryFilter: React.FC<{ onCategoryChange: (category: string) => void }> = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((response) => response.json())
      .then((data) => setCategories(data.categories.map((category: any) => category.strCategory)));
  }, []);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(event.target.value);
  };

  return (
    <div>
      <h3>Фільтрувати за категорією:</h3>
      <select onChange={handleCategoryChange}>
        <option value="">Виберіть категорію</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;