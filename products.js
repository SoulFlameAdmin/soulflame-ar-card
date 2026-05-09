(function () {
  "use strict";

  const DEFAULT_GLB = "./uploads_files_6479452_187.glb";
  const DEFAULT_USDZ = "";

  const products = [
    {
      id: "classic",
      name: "Pizza Hit Classic",
      shortName: "Classic",
      price: "12.90 лв.",
      sizeLabel: "30 CM",
      description: "Класическа Pizza Hit пица с реалистичен 3D preview и AR поставяне върху маса.",
      glb: DEFAULT_GLB,
      usdz: DEFAULT_USDZ,
      realWidth: 0.30
    },
    {
      id: "pepperoni",
      name: "Pizza Hit Pepperoni",
      shortName: "Pepperoni",
      price: "14.90 лв.",
      sizeLabel: "32 CM",
      description: "Пеперони стил — подходящ за демонстрация на AR меню пред клиент.",
      glb: DEFAULT_GLB,
      usdz: DEFAULT_USDZ,
      realWidth: 0.32
    },
    {
      id: "family",
      name: "Pizza Hit Family",
      shortName: "Family",
      price: "19.90 лв.",
      sizeLabel: "43 CM",
      description: "Голяма фамилна пица за по-силен AR ефект върху реална маса.",
      glb: DEFAULT_GLB,
      usdz: DEFAULT_USDZ,
      realWidth: 0.43
    },
    {
      id: "mini",
      name: "Pizza Hit Mini",
      shortName: "Mini",
      price: "8.90 лв.",
      sizeLabel: "20 CM",
      description: "Малък размер за бърз preview и тест на AR скала.",
      glb: DEFAULT_GLB,
      usdz: DEFAULT_USDZ,
      realWidth: 0.20
    },
    {
      id: "showcase",
      name: "Pizza Hit Showcase",
      shortName: "Showcase",
      price: "24.90 лв.",
      sizeLabel: "60 CM",
      description: "Голяма showcase версия за силно визуално представяне.",
      glb: DEFAULT_GLB,
      usdz: DEFAULT_USDZ,
      realWidth: 0.60
    }
  ];

  const DEFAULT_PRODUCT_ID = "classic";

  function normalizeProduct(product) {
    if (!product) return null;

    return {
      id: product.id || DEFAULT_PRODUCT_ID,
      name: product.name || "Pizza Hit Classic",
      shortName: product.shortName || product.name || "Classic",
      price: product.price || "",
      sizeLabel: product.sizeLabel || "30 CM",
      description: product.description || "",
      glb: product.glb || DEFAULT_GLB,
      usdz: product.usdz || DEFAULT_USDZ,
      realWidth: Number(product.realWidth || 0.30)
    };
  }

  function getPizzaHitProductById(id) {
    const safeId = String(id || DEFAULT_PRODUCT_ID).trim();

    const found =
      products.find((product) => product.id === safeId) ||
      products.find((product) => product.id === DEFAULT_PRODUCT_ID) ||
      products[0];

    return normalizeProduct(found);
  }

  function getPizzaHitProductFromUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get("product") || DEFAULT_PRODUCT_ID;
      return getPizzaHitProductById(productId);
    } catch (error) {
      console.warn("Pizza Hit product URL fallback:", error);
      return getPizzaHitProductById(DEFAULT_PRODUCT_ID);
    }
  }

  window.PIZZA_HIT_PRODUCTS = products.map(normalizeProduct);
  window.PIZZA_HIT_DEFAULT_PRODUCT_ID = DEFAULT_PRODUCT_ID;
  window.getPizzaHitProductById = getPizzaHitProductById;
  window.getPizzaHitProductFromUrl = getPizzaHitProductFromUrl;
})();