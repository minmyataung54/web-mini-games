export const PageEndPoint = {
    home: { url: "/", label: "Home" },
    catchIngridients: { url: "/catch-ingridients", label: "Catch the ingridients" },
    catchBottles: { url: "/catch-bottles", label: "Catch the bottles" },
  };
  
  export const PageEndPointArray = Object.entries(PageEndPoint).map(
    ([key, { url, label }]) => ({
      key,
      url,
      label,
    }),
  );
  