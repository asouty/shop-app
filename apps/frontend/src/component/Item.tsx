import React from "react";
import { Slide, SlideshowRef } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { ItemEntity } from "backend/dist/model/item.entity";
import { Button } from "@mui/material";

export default function Item(props: { item: ItemEntity }) {
  const slideRef = React.createRef<SlideshowRef>();
  const properties = {
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: true,
  };
  return (
    <>
      <h4 id={props.item.id}>{props.item.title}</h4>
      <div
        style={{
          display: "flex",
          alignItems: "right",
          justifyContent: "right",
          height: 450,
        }}
      >
        <div style={{ minWidth: 600, minHeight: 100 }}>
          {props.item.images.length == 1 && (
            <img
              width={450}
              style={{ objectFit: "contain", height: "100%" }}
              src={props.item.images[0]}
              key={0}
            />
          )}
          {props.item.images.length > 1 && (
            <Slide
              ref={slideRef}
              {...properties}
              duration={5000 + Math.random() * 5}
            >
              {props.item.images.map((image: string, index: React.Key) => (
                <img
                  width={450}
                  style={{ objectFit: "contain", height: "100%" }}
                  src={image}
                  key={index}
                />
              ))}
            </Slide>
          )}
        </div>
        <div
          style={{
            minWidth: 500,
            minHeight: 100,
            maxWidth: 100,
            paddingLeft: 10,
            textAlign: "left",
          }}
          className={"white-space-pre-line"}
        >
          {props.item.description.substring(0, 800)}
          <Button>Add</Button>
        </div>
      </div>
    </>
  );
}
