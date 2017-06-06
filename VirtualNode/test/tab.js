export default `<div class="tab {$isShow ? show : no-show} {$theme}">
  <h4>{$title}</h4>
  <div class="tab-options">
   {$for option in tabs}
      <tabs onclick="{$option.onclick}">
        <span class="name">{$options.name}</span>
        <span class="sub-name">{$options.subName}</span>
      </tabs>
   {$/for}
  </div>
  <tab-view content="{$views.tab1} {$views.tab2.content} {$views.tab2.test3.content} {$sex[isSelect]}"/>
</div>`;
