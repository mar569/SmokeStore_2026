// hooks/useFilters.ts (обновленный хук для управления фильтрами)
import { useState } from 'react';

export const useFilters = () => {
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<number[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 50000]);
    setSelectedWeights([]);
    setSelectedFlavors([]);
    setSelectedColors([]);
    setShowAllBrands(false);
  };

  const handleBrandToggle = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handleWeightToggle = (weight: number) => {
    setSelectedWeights((prev) =>
      prev.includes(weight)
        ? prev.filter((w) => w !== weight)
        : [...prev, weight]
    );
  };

  const handleFlavorToggle = (flavor: string) => {
    setSelectedFlavors((prev) =>
      prev.includes(flavor)
        ? prev.filter((f) => f !== flavor)
        : [...prev, flavor]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  return {
    priceRange,
    setPriceRange,
    selectedBrands,
    selectedWeights,
    selectedFlavors,
    selectedColors,
    showAllBrands,
    setShowAllBrands,
    clearFilters,
    handleBrandToggle,
    handleWeightToggle,
    handleFlavorToggle,
    handleColorToggle,
  };
};
