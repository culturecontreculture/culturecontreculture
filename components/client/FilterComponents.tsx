'use client';

import React from 'react';

interface FilterCheckboxProps {
  label: string;
  defaultChecked: boolean;
}

export const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ label, defaultChecked }) => {
  return (
    <label className="flex items-center cursor-pointer font-mono text-text-secondary">
      <input 
        type="checkbox" 
        className="mr-2 h-4 w-4 accent-primary"
        defaultChecked={defaultChecked}
        onChange={(e) => {
          const url = new URL(window.location.href);
          if (e.target.checked) {
            url.searchParams.set('showInactive', 'true');
          } else {
            url.searchParams.delete('showInactive');
          }
          window.location.href = url.toString();
        }}
      />
      {label}
    </label>
  );
};

interface ProductsPerPageProps {
  defaultValue: string;
}

export const ProductsPerPage: React.FC<ProductsPerPageProps> = ({ defaultValue }) => {
  return (
    <select 
      className="bg-background text-text-primary border border-primary p-2 font-mono"
      defaultValue={defaultValue}
      onChange={(e) => {
        const url = new URL(window.location.href);
        url.searchParams.set('limit', e.target.value);
        url.searchParams.delete('page'); // Réinitialiser la page
        window.location.href = url.toString();
      }}
    >
      <option value="6">6 par page</option>
      <option value="12">12 par page</option>
      <option value="24">24 par page</option>
      <option value="48">48 par page</option>
    </select>
  );
};
