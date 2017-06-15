export default `<div class="tab {$isShow ? show : no-show} {$theme}">
  <h4>{$title}</h4>
  <div class="tab-options">
    <tabs for="option in tabs" onclick="{$option.onclick}">
      <span class="name">{$options.name}</span>
      <span class="sub-name">{$options.subName}</span>
    </tabs>
  </div>
  <tab-view content="{$views.tab1} {$views.tab2.content}">
    {$isShow ? (ifEmpty ? empty : noshow) : (ifEmpty ? empty : noshow)}
    {$isShow && ifEmpty ? isShow ? empty : isShow && ifEmpty ? show : noshow : noshow}
    {$isShow ? isShow ? empty : isShow ? show : noshow : isShow ? show : noshow}
    {$views.tab2.test3.content}
    {$sex[isSelect]}
    {$sex['man']}
    {$sex.desc['man']}
    {$sex.desc.desc['male']}
  </tab-view>
</div>`;
