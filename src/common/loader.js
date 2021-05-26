import {html} from '../lib.js';

 export const loaderTemplate = () => html`
<!--    <h2>Зарежда се!</h2>-->

<!--    <div class="loader" ></div>-->
<h1 class="loading-catalog">Зарежда се!</h1>
<div id="cooking">
 <div class="bubble"></div>
 <div class="bubble"></div>
 <div class="bubble"></div>
 <div class="bubble"></div>
 <div class="bubble"></div>
 <div id=area>
  <div id="sides">
   <div id="pan"></div>
   <div id="handle"></div>
  </div>
  <div id="pancake">
   <div id="pastry"></div>
  </div>
 </div>
</div>

`;
