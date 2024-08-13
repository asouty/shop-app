/**
 * @jest-environment jsdom
 */
import Item from "./Item.tsx";
import { render, screen } from "@testing-library/react";
import { ItemEntity } from "backend/dist/model/item.entity";

test("renders the item component", async () => {
  const item = new ItemEntity();
  item.title = "MyItem";
  item.id = "MyItemId";
  render(<Item item={item} />);
  await screen.findAllByText("MyItem");
});
