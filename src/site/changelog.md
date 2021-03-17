---
title: Changelog
layout: layouts/base.njk
subtitle: Updates, changes, bug fixes and all that good stuff.
---

## Change 1 

{%- for page in collections.post -%}
    {{ page.data.title }} - {{ page.date | dateDisplay("LLLL d, y") }}  
{%- endfor -%}

<div class="tag">
    <span>Update<span>
</div>

Created the thing