import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import LayoutWrapper from "./index";


storiesOf("LayoutWrapper", module)
  .addDecorator(story =>
    <div className="blue storybook-center" onClick={action("click")}>
      <div className="stars" />
      <div style={{ border: "4px dashed white", padding: "10px 0" }}>
        {story()}
      </div>
    </div>
  )
  .add("row between top", () =>
    <LayoutWrapper flexModifier='row-between-top'>
      <div style={{ background: "white", padding: "50px", color: "black" }}> A </div>
      <span className='centered'>Amazing</span>
      <div style={{ background: "white", padding: "50px", color: "black" }}> B </div>
    </LayoutWrapper>
  )
  .add("row bottom breaking", () =>
    <LayoutWrapper flexModifier='row-bottom-breaking'>
      <div style={{ background: "white", padding: "50px", color: "black" }}> A </div>
      <span className='centered'>Amazing</span>
      <div style={{ background: "white", padding: "50px", color: "black" }}> B </div>
    </LayoutWrapper>
  )
  .add("row around breaking", () =>
    <LayoutWrapper flexModifier='row-around-breaking'>
      <div style={{ background: "white", padding: "50px", color: "black" }}> A </div>
      <span className='centered'>Amazing</span>
      <div style={{ background: "white", padding: "50px", color: "black" }}> B </div>
    </LayoutWrapper>
  )
  .add("row center breaking", () =>
    <LayoutWrapper flexModifier='row-center-breaking'>
      <div style={{ background: "white", padding: "50px", color: "black" }}> A </div>
      <span className='centered'>Amazing</span>
      <div style={{ background: "white", padding: "50px", color: "black" }}> B </div>
    </LayoutWrapper>
  )
  .add("row between breaking", () =>
    <LayoutWrapper flexModifier='row-between-breaking'>
      <div style={{ background: "white", padding: "50px", color: "black" }}> A </div>
      <span className='centered'>Amazing</span>
      <div style={{ background: "white", padding: "50px", color: "black" }}> B </div>
    </LayoutWrapper>
  )
  .add("row between reverse", () =>
    <LayoutWrapper flexModifier='row-between-reverse'>
      <div style={{ background: "white", padding: "50px", color: "black" }}> A </div>
      <span className='centered'>Amazing</span>
      <div style={{ background: "white", padding: "50px", color: "black" }}> B </div>
    </LayoutWrapper>
  )
  .add("column center", () =>
    <LayoutWrapper flexModifier='column-center'>
      <div style={{ background: "white", padding: "50px", color: "black" }}> A </div>
      <span className='centered'>Amazing</span>
      <div style={{ background: "white", padding: "50px", color: "black" }}> B </div>
    </LayoutWrapper>
  )
  .add("column center reverse", () =>
    <LayoutWrapper flexModifier='column-center-reverse'>
      <div style={{ background: "white", padding: "50px", color: "black" }}> A </div>
      <span className='centered'>Amazing</span>
      <div style={{ background: "white", padding: "50px", color: "black" }}> B </div>
    </LayoutWrapper>
  )
  .add("column center start breaking", () =>
    <LayoutWrapper flexModifier='column-center-start-breaking'>
      <div style={{ background: "white", padding: "50px", color: "black" }}> A </div>
      <span className='centered'>Amazing</span>
      <div style={{ background: "white", padding: "50px", color: "black" }}> B </div>
    </LayoutWrapper>
  )
  .add("card list", () =>
    <LayoutWrapper flexModifier='card-list'>
      <div style={{ background: "white", padding: "50px", color: "black" }}> A </div>
      <span className='centered'>Amazing</span>
      <div style={{ background: "white", padding: "50px", color: "black" }}> B </div>
    </LayoutWrapper>
  )
  .add("details content", () =>
    <LayoutWrapper flexModifier='details-content'>
      <div style={{ background: "white", padding: "50px", color: "black" }}> A </div>
      <span className='centered'>Amazing</span>
      <div style={{ background: "white", padding: "50px", color: "black" }}> B </div>
    </LayoutWrapper>
  );

