(function () {
  const DEFAULT_GLB = "./uploads_files_6479452_187.glb";

  window.PIZZA_HIT_PRODUCTS = [
    {
      id: "classic",
      name: "Pizza Hit Classic",
      shortName: "Classic",
      price: "12.90 лв.",
      sizeLabel: "30 CM",
      description: "Класическа Pizza Hit пица с реалистичен 3D preview и AR поставяне върху маса.",
      glb: DEFAULT_GLB,
      usdz: "",
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
      usdz: "",
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
      usdz: "",
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
      usdz: "",
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
      usdz: "",
      realWidth: 0.60
    }
  ];

  window.PIZZA_HIT_DEFAULT_PRODUCT_ID = "classic";

  window.getPizzaHitProductById = function (id) {
    const products = window.PIZZA_HIT_PRODUCTS || [];
    return (
      products.find((product) => product.id === id) ||
      products.find((product) => product.id === window.PIZZA_HIT_DEFAULT_PRODUCT_ID) ||
      products[0]
    );
  };

  window.getPizzaHitProductFromUrl = function () {
    const params = new URLSearchParams(window.location.search);
    return window.getPizzaHitProductById(params.get("product"));
  };
})();