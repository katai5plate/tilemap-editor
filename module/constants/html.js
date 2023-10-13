//@ts-check
export const tilemapEditorRootHTML = ({ width, height, mapTileWidth }) => `
<div id="tilemapjs_root" class="card tilemapjs_root">
 <a id="downloadAnchorElem" style="display:none"></a>
<div class="tileset_opt_field header">
<div class="menu file">
     <span> File </span>
     <div class="dropdown" id="fileMenuDropDown">                            
         <a class="button item button-as-link" href="#popup2">About</a>
         <div id="popup2" class="overlay">
         <div class="popup">
         <h4>Tilemap editor</h4>
         <a class="close" href="#">&times;</a>
         <div class="content"> 
             <div>Created by Todor Imreorov (blurymind@gmail.com)</div>
             <br/>
             <div><a class="button-as-link" href="https://github.com/blurymind/tilemap-editor">Project page (Github)</a></div>
             <div><a class="button-as-link" href="https://ko-fi.com/blurymind">Donate page (ko-fi)</a></div>
             <br/>
             <div>Instructions:</div>
             <div>right click on map - picks tile</div>
             <div>mid-click - erases tile</div>
             <div>left-click adds tile</div> 
             <div>right-click on tileset - lets you change tile symbol or metadata</div>
             <div>left-click - selects tile </div>
         </div>
         </div>
         </div>
     </div>
 </div>
 <div>
     <div id="toolButtonsWrapper" class="tool_wrapper">             
       <input id="tool0" type="radio" value="0" name="tool" checked class="hidden"/>
       <label for="tool0" title="paint tiles" data-value="0" class="menu">
           <div id="flipBrushIndicator">🖌️</div>
           <div class="dropdown">
             <div class="item nohover">Brush tool options</div>
             <div class="item">
                 <label for="toggleFlipX" class="">Flip tile on x</label>
                 <input type="checkbox" id="toggleFlipX" style="display: none"> 
                 <label class="toggleFlipX"></label>
             </div>
           </div>
       </label>
       <input id="tool1" type="radio" value="1" name="tool" class="hidden"/>
       <label for="tool1" title="erase tiles" data-value="1">🗑️</label>
       <input id="tool2" type="radio" value="2" name="tool" class="hidden"/> 
       <label for="tool2" title="pan" data-value="2">✋</label>
       <input id="tool3" type="radio" value="3" name="tool" class="hidden"/> 
       <label for="tool3" title="pick tile" data-value="3">🎨</label>
       <input id="tool4" type="radio" value="4" name="tool" class="hidden"/> 
       <label for="tool4" title="random from selected" data-value="4">🎲</label>
        <input id="tool5" type="radio" value="5" name="tool" class="hidden"/> 
       <label for="tool5" title="fill on layer" data-value="5">🌈</label>
     </div>
 </div>

 <div class="tool_wrapper">
     <label id="undoBtn" title="Undo">↩️️</label>
     <label id="redoBtn" title="Redo">🔁️</label>
     <label id="zoomIn" title="Zoom in">🔎️+</label>
     <label id="zoomOut" title="Zoom out">🔎️-</label>
     <label id="zoomLabel">️</label>
 </div>
     
 <div>
     <button class="primary-button" id="confirmBtn">"apply"</button>
 </div>

</div>
<div class="card_body">
 <div class="card_left_column">
 <details class="details_container sticky_left" id="tilesetDataDetails" open="true">
   <summary >
     <span  id="mapSelectContainer">
     | <select name="tileSetSelectData" id="tilesetDataSel" class="limited_select"></select>
     <button id="replaceTilesetBtn" title="replace tileset">r</button>
     <input id="tilesetReplaceInput" type="file" style="display: none" />
     <button id="addTilesetBtn" title="add tileset">+</button>
     <input id="tilesetReadInput" type="file" style="display: none" />
     <button id="removeTilesetBtn" title="remove">-</button>
     </span>
   </summary>
   <div>
       <div class="tileset_opt_field">
         <span>Tile size:</span>
         <input type="number" id="cropSize" name="crop" placeholder="32" min="1" max="128">
       </div>
       <div class="tileset_opt_field">
         <span>Tileset loader:</span>
         <select name="tileSetLoaders" id="tileSetLoadersSel"></select>
       </div>
       <div class="tileset_info" id="tilesetSrcLabel"></div>
       <div class="tileset_info" id="tilesetHomeLink"></div>
       <div class="tileset_info" id="tilesetDescriptionLabel"></div> 
   </div>

 </details>
 <div class="select_container layer sticky_top sticky_left" id="tilesetSelectContainer">
     <span id="setSymbolsVisBtn">👓️</span>

     <select name="tileData" id="tileDataSel">
         <option value="">Symbols</option>
     </select>
     <button id="addTileTagBtn" title="add">+</button>
     <button id="removeTileTagBtn" title="remove">-</button>
 </div>

 <div class="select_container sticky_top2 sticky_settings sticky_left" style="display: none;flex-direction:column;" id="tileFrameSelContainer">
     <div class="item nohover layer tileset_opt_field">
         <div title="Object parameters" class="menu parameters" id="objectParametersEditor">
             ⚙
             <div class="dropdown">        
                 <div class="item"> 
                     💡 object:
                     <button id="renameTileFrameBtn" title="rename object">📝</button>
                     <button id="removeTileFrameBtn" title="remove">🗑️</button>
                      <button id="addTileFrameBtn" title="add new object">+ new</button>
                 </div>
<!--                        <div class="item nohover">Object parameters:</div>-->
             </div>
         ️</div>
         <select name="tileFrameData" id="tileFrameSel" style="max-width: 150px;">
<!--            <option value="anim1">anim1rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr</option>-->
         </select>
         frames: <input id="tileFrameCount" value="1" type="number" min="1">
<!--                <button id="renameTileFrameBtn" title="rename object">r</button>-->
<!--                <button id="addTileFrameBtn" title="add new object">+</button>-->
<!--                <button id="removeTileFrameBtn" title="remove object">-</button>-->

     </div>
     <div class="item nohover layer tileset_opt_field"> 
       <div title="Animation parameters" class="menu parameters" id="objectParametersEditor">
             ⚙
             <div class="dropdown">        
                 <div class="item"> 
                     🎞️ animation:
                     <button id="renameTileAnimBtn" title="rename animation">📝</button>
                     <button id="removeTileAnimBtn" title="remove">🗑️</button>
                     <button id="addTileAnimBtn" title="add new animation">+ new</button>
                 </div>
<!--                        <div class="item nohover">Object parameters:</div>-->
             </div>
         ️</div>
         <select name="tileAnimData" id="tileAnimSel" style="max-width: 72px">
 <!--          <option value="anim1">anim1</option>-->
         </select>
         <input id="animStart" value="1" type="number" min="1" title="animation start" class="two-digit-width"> to 
         <input id="animEnd" value="1" type="number" min="1" title="animation end" class="two-digit-width">

         <span title="animation speed">⏱</span>
         <input id="animSpeed" value="1" type="number" min="1" title="animation speed" class="two-digit-width">
         <span class="item" title="loop animation">
             <input type="checkbox" id="animLoop" style="display: none" checked>
             <label for="animLoop" class="animLoop">️</label>
         </span>
<!--                <button id="renameTileAnimBtn" title="rename animation">r</button>-->
<!--                <button id="addTileAnimBtn" title="add new animation">+</button>-->
<!--                <button id="removeTileAnimBtn" title="remove animation">-</button>-->


    </div>     
 </div>

<div class="tileset-container">
 <div class="tileset-container-selection"></div>
 <canvas id="tilesetCanvas" />
<!--        <div id="tilesetGridContainer" class="tileset_grid_container"></div>-->
 
</div>
 </div>
 <div class="card_right-column" style="position:relative" id="canvas_drag_area">
 <div class="canvas_wrapper" id="canvas_wrapper">
   <canvas id="mapCanvas" width="${width}" height="${height}"></canvas>
   <div class="canvas_resizer" resizerdir="y"><input value="1" type="number" min="1" resizerdir="y"><span>-y-</span></div>
   <div class="canvas_resizer vertical" resizerdir="x"><input value="${mapTileWidth}" type="number" min="1" resizerdir="x"><span>-x-</span></div>
 </div>
 </div>
<div class="card_right-column layers">
<div id="mapSelectContainer" class="tilemaps_selector">
     <select name="mapsData" id="mapsDataSel"></select>
     <button id="addMapBtn" title="Add tilemap">+</button>
     <button id="removeMapBtn" title="Remove tilemap">-</button>        
     <button id="duplicateMapBtn" title="Duplicate tilemap">📑</button>     
     <a class="button" href="#popup1">🎚️</a>
     <div id="popup1" class="overlay">
     <div class="popup">
     <h4>TileMap settings</h4>
     <a class="close" href="#">&times;</a>
     <div class="content">
         <span class="flex">Width: </span><input id="canvasWidthInp" value="1" type="number" min="1">
         <span class="flex">Height: </span><input id="canvasHeightInp" value="1" type="number" min="1">
         <br/><br/>
         <span class="flex">Grid tile size: </span><input type="number" id="gridCropSize" name="crop" placeholder="32" min="1" max="128">
         <span class="flex">Grid color: </span><input type="color" value="#ff0000" id="gridColorSel">
         <span class="flex">Show grid above: </span> <input type="checkbox" id="showGrid">
         <br/><br/>
         <div class="tileset_opt_field">
             <button id="renameMapBtn" title="Rename map">Rename</button>
             <button id="clearCanvasBtn" title="Clear map">Clear</button>
         </div>
     </div>
     </div>
     </div>
 </div>

 <label class="sticky add_layer">
     <label id="activeLayerLabel" class="menu">
     Editing Layer
     </label>
     <button id="addLayerBtn" title="Add layer">+</button>
 </label>
 <div class="layers" id="layers">
</div>
</div>
</div>
 `;

export const activeLayerLabelHTML = ({ name, opacity }) => `
 Editing Layer: ${name}
 <div class="dropdown left">
     <div class="item nohover">Layer: ${name} </div>
     <div class="item">
         <div class="slider-wrapper">
           <label for="layerOpacitySlider">Opacity</label>
           <input type="range" min="0" max="1" value="1" id="layerOpacitySlider" step="0.01">
           <output for="layerOpacitySlider" id="layerOpacitySliderValue">${opacity}</output>
         </div>
     </div>
 </div>
`;

export const layersElementHTML = ({ index, layer, enableButton }) => `
<div class="layer">
  <div id="selectLayerBtn-${index}" class="layer select_layer" tile-layer="${index}" title="${
  layer.name
}">${layer.name} ${layer.opacity < 1 ? ` (${layer.opacity})` : ""}</div>
  <span id="setLayerVisBtn-${index}" vis-layer="${index}"></span>
  <div id="trashLayerBtn-${index}" trash-layer="${index}" ${
  enableButton ? "" : `disabled="true"`
}>🗑️</div>
</div>
`;
