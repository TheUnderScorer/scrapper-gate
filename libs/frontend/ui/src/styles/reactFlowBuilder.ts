import { css } from '@emotion/react';

export const reactFlowBuilderStyles = css`
  .react-flow {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .react-flow__renderer,
  .react-flow__pane,
  .react-flow__selectionpane {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .react-flow__pane {
    z-index: 1;
  }

  .react-flow__renderer {
    z-index: 4;
  }

  .react-flow__selectionpane {
    z-index: 5;
  }

  .react-flow__selection {
    position: absolute;
    top: 0;
    left: 0;
  }

  .react-flow__edges {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 2;
  }

  .react-flow__edge {
    pointer-events: all;
  }

  .react-flow__edge.inactive {
    pointer-events: none;
  }

  @-webkit-keyframes dashdraw {
    from {
      stroke-dashoffset: 10;
    }
  }

  @keyframes dashdraw {
    from {
      stroke-dashoffset: 10;
    }
  }

  .react-flow__edge-path {
    fill: none;
  }

  .react-flow__edge-text {
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .react-flow__connection {
    pointer-events: none;
  }

  .react-flow__connection .animated {
    stroke-dasharray: 5;
    -webkit-animation: dashdraw 0.5s linear infinite;
    animation: dashdraw 0.5s linear infinite;
  }

  .react-flow__connection-path {
    fill: none;
  }

  .react-flow__nodes {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    transform-origin: 0 0;
    z-index: 3;
  }

  .react-flow__node {
    position: absolute;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: all;
    transform-origin: 0 0;
  }

  .react-flow__nodesselection {
    z-index: 3;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transform-origin: left top;
    pointer-events: none;
  }

  .react-flow__nodesselection-rect {
    position: absolute;
    pointer-events: all;
    cursor: -webkit-grab;
    cursor: grab;
  }

  .react-flow__handle {
    pointer-events: none;
  }

  .react-flow__handle.connectable {
    pointer-events: all;
  }

  .react-flow__handle-bottom {
    top: auto;
    left: 50%;
    bottom: -4px;
    transform: translate(-50%, 0);
  }

  .react-flow__handle-top {
    left: 50%;
    top: -4px;
    transform: translate(-50%, 0);
  }

  .react-flow__handle-left {
    top: 50%;
    left: -4px;
    transform: translate(0, -50%);
  }

  .react-flow__handle-right {
    right: -4px;
    top: 50%;
    transform: translate(0, -50%);
  }

  .react-flow__edgeupdater {
    cursor: move;
  }

  /* additional components */

  .react-flow__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .react-flow__controls {
    position: absolute;
    z-index: 5;
    bottom: 10px;
    left: 10px;
  }

  .react-flow__controls-button {
    width: 24px;
    height: 24px;
  }

  .react-flow__controls-button svg {
    width: 100%;
  }

  .react-flow__minimap {
    position: absolute;
    z-index: 5;
    bottom: 10px;
    right: 10px;
  }

  .react-flow__selection {
    background: rgba(0, 89, 220, 0.08);
    border: 1px dotted rgba(0, 89, 220, 0.8);
  }

  .react-flow__edge.selected .react-flow__edge-path {
    stroke: #555;
  }

  .react-flow__edge.animated path {
    stroke-dasharray: 5;
    -webkit-animation: dashdraw 0.5s linear infinite;
    animation: dashdraw 0.5s linear infinite;
  }

  .react-flow__edge.updating .react-flow__edge-path {
    stroke: #777;
  }

  .react-flow__edge-path {
    stroke: #b1b1b7;
    stroke-width: 1;
  }

  .react-flow__edge-text {
    font-size: 10px;
  }

  .react-flow__edge-textbg {
    fill: white;
  }

  .react-flow__connection-path {
    stroke: #b1b1b7;
    stroke-width: 1;
  }

  .react-flow__node {
    cursor: -webkit-grab;
    cursor: grab;
  }

  .react-flow__node-default,
  .react-flow__node-input,
  .react-flow__node-output {
    padding: 10px;
    border-radius: 3px;
    width: 150px;
    font-size: 12px;
    color: #222;
    text-align: center;
    border-width: 1px;
    border-style: solid;
  }

  .react-flow__node-default.selectable:hover,
  .react-flow__node-input.selectable:hover,
  .react-flow__node-output.selectable:hover {
    box-shadow: 0 1px 4px 1px rgba(0, 0, 0, 0.08);
  }

  .react-flow__node-input {
    background: #fff;
    border-color: #0041d0;
  }

  .react-flow__node-input.selected,
  .react-flow__node-input.selected:hover {
    box-shadow: 0 0 0 0.5px #0041d0;
  }

  .react-flow__node-input .react-flow__handle {
    background: #0041d0;
  }

  .react-flow__node-default {
    background: #fff;
    border-color: #1a192b;
  }

  .react-flow__node-default.selected,
  .react-flow__node-default.selected:hover {
    box-shadow: 0 0 0 0.5px #1a192b;
  }

  .react-flow__node-default .react-flow__handle {
    background: #1a192b;
  }

  .react-flow__node-output {
    background: #fff;
    border-color: #ff0072;
  }

  .react-flow__node-output.selected,
  .react-flow__node-output.selected:hover {
    box-shadow: 0 0 0 0.5px #ff0072;
  }

  .react-flow__node-output .react-flow__handle {
    background: #ff0072;
  }

  .react-flow__nodesselection-rect {
    background: rgba(0, 89, 220, 0.08);
    border: 1px dotted rgba(0, 89, 220, 0.8);
  }

  .react-flow__handle {
    position: absolute;
    width: 6px;
    height: 6px;
    background: #555;
    border: 1px solid white;
    border-radius: 100%;
  }

  .react-flow__handle.connectable {
    cursor: crosshair;
  }

  .react-flow__minimap {
    background-color: #fff;
  }

  .react-flow__controls {
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.08);
  }

  .react-flow__controls-button {
    background: #fefefe;
    border-bottom: 1px solid #eee;
    box-sizing: content-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding: 5px;
  }

  .react-flow__controls-button svg {
    max-width: 12px;
    max-height: 12px;
  }

  .react-flow__controls-button:hover {
    background: #f4f4f4;
  }
`;
