"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchScreen from "@components/search/SearchScreen";
import { useCategory } from "@hooks/azli_hooks/usecategory";
import { useProduct } from "@hooks/azli_hooks/useProduct";
import { useMobileHeader } from "@context/MobileHeaderContext"; // Import
import { getShowingAttributes } from "@services/AttributeServices";
import { getGlobalSetting } from "@services/SettingServices";

export default function Search() {
  const params = useSearchParams();
  const id = params.get("category") || "";
  const query = params.get("query") || "";

  // useEffect(() => {
  //   console.log("🔸 category category ID:", id);
  // }, [id]);

  // 🔹 States for attributes & settings fetched directly
  const [attributes, setAttributes] = useState([]);
  const [currency, setCurrency] = useState("₹");

  // 🔹 Hooks for category & product management
  const { categories, handleFetchCategories } = useCategory();
  const { productsList, loading, handleFetchProductsList } = useProduct();

  // ✅ Fetch attributes & global settings once on mount
  useEffect(() => {
    async function fetchStaticData() {
      try {
        const [{ attributes }, { globalSetting }] = await Promise.all([
          getShowingAttributes(),
          getGlobalSetting(),
        ]);

        setAttributes(attributes || []);
        setCurrency(globalSetting?.default_currency || "₹");
      } catch (err) {
        console.error("Error fetching attributes/settings:", err);
      }
    }

    fetchStaticData();
  }, []);

   useEffect(() => {
   if (!categories || categories.length === 0) {
     handleFetchCategories();
   }
 }, []);



  const [page, setPage] = useState(1);
  const limit = 20;

  // 🔹 Dynamic Title Setting
  const { setMobileHeaderTitle } = useMobileHeader(); // 👈 Import usage

  useEffect(() => {
    // console.log("🔍 Search Page Title Logic - ID:", id, "Categories:", categories?.length);

    if (id && categories?.length > 0) {
      // Find category name
      // Try string comparison for IDs just in case
      const currentCategory = categories.find(cat => 
          String(cat._id) === String(id) || String(cat.id) === String(id) || cat.parent === id
      ); 
      
      // console.log("Category Found:", currentCategory);

      if (currentCategory) {
        const catName = currentCategory?.name?.en || currentCategory?.name || "Category";
        setMobileHeaderTitle(catName);
        return; 
      }
    } 
    
    if (query) {
      setMobileHeaderTitle(`Search: ${query}`);
    } else if (id) { 
       // ID exists but category not found yet? 
       // Don't default to "Products" if we are waiting for categories
       if (categories?.length > 0) {
          // Categories loaded but ID not found? wierd.
          setMobileHeaderTitle("Category");
       } else {
          // Waiting for categories...
          // setMobileHeaderTitle("Loading..."); // Optional
       }
    } else {
        // Fallback or "All Categories" if needed, but usually won't hit here for single cat
        setMobileHeaderTitle("Products");
    }
  }, [id, query, categories]);

  // Infinite Scroll setup
  useEffect(() => {
    if (id || query) {
      setPage(1);
      handleFetchProductsList({ catId: id, page: 1, limit });
    }
  }, [id, query]);

  // Infinite Scroll
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 50
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);

  const loadMore = async () => {
    const nextPage = page + 1;
    const hasMore = await handleFetchProductsList({
      catId: id,
      page: nextPage,
      limit,
    });
    if (hasMore) setPage(nextPage);
  };

  return (
    <SearchScreen
      products={productsList}
      attributes={attributes}
      categories={categories}
      currency={currency}
      loading={loading}
    />
  );
}
