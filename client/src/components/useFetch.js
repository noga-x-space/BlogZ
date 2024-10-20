import React, { useState } from "react";

async function useFetch(text) {
  const [data, setData] = useState(null);
  try {
    const response = await fetch(`http://localhost:8000/${text}`);
    const json = await response.json();
    setData(json);
  } catch (err) {
    console.error(err);
  }
  return data;
}

export default useFetch;
