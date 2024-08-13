import { useEffect, useRef, useState } from "react";
import { getAuthRequest } from "../hook/Request.tsx";
import Item from "./Item.tsx";
import { ItemEntity } from "backend/dist/model/item.entity";

export const ItemId = "item";
export default function Items() {
  const [items, setItems] = useState<ItemEntity[]>([]);
  const load = useRef();
  const fetchData = async () =>
    setItems(await getAuthRequest<ItemEntity[]>("/api/item"));

  useEffect(() => {
    fetchData().catch(() => setItems([]));
  }, [load]);
  return (
    <>
      {items.map((item) => (
        <Item item={item} />
      ))}
    </>
  );
}
