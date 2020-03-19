# Carousel 3D
Content slider that works in three directions

Sister project of Carousel 2D (https://github.com/yamaken1343/carousel-2d)

## Demo
https://yamaken1343.github.io/carousel-3d/

## Features
   - Move in three directions
   - Full vanilla js
   - Lightweight
   - Easy customize
   
## Quick start
### install
download carousel3d.js and carousel3d.css and load to your html file
### Usage
Place content in html
```html
<div id="test" class="carousel3d"></div>
<div id="testView"></div>
```

write css
```css
:root {
    --carousel3dControllerSize: 20px;
    --carousel3dControllerWidth: 3px;
    --carousel3dControllerColor: #0500ff;
}

#freeID {
    width: 500px;
    height: 400px;
    ...
}
.content {
    width: 100%;
    height: 100%;
    ...
}
```

and write javascript
```javascript
let list = [];
    for (let i = 0; i < 125; i++) {
        list.push(`demo/img/${i}.png`)
}
let freeId = new Carousel3d('freeID', list, {
    contentHeightNum: 5,  
    contentWidthNum: 5,  
    contentDepthNum: 5,  
    contentWidth: '160px',  // image size
    contentHeight: `120px`,
    overlapGap: 8,  // %
    overlapVisible: 4,  // Depth visible content num
    contentPadding: '20px',  
    targetX: 2,  // init move content
    targetY: 2,
    targetZ: 2,
    useView: true,
    useController: true
});
``` 