class Carousel3d {
    constructor(id, contentList, property) {
        this.setProperty(property);
        this.colClass = id + 'Col_';
        this.rowClass = id + 'Row_';
        this.depClass = id + 'Dep_';
        this.viewid = id + 'View';
        this.moveEventid = id + 'Move';
        this.rootid = id;

        let contentNum = this.contentHeightNum * this.contentHeightNum * this.contentDepthNum;

        this.positionX = 0;
        this.positionY = 0;
        if (contentList) {
            if (contentNum !== contentList.length) {
                console.warn('id:' + id + ': Content count and content list count are inconsistent. ' +
                    'Make sure that the product of "contentHeightNum" and "contentHeightNum" matches the number of elements in "contentList".');
            }
            let root = document.getElementById(this.rootid);
            for (let i = 0; i < this.contentHeightNum; i++) {
                let row = document.createElement('div');
                row.classList.add(this.rowClass, 'carousel3dRow');
                for (let j = 0; j < this.contentWidthNum; j++) {
                    let col = document.createElement('div');
                    col.classList.add(this.colClass, 'carousel3dCol');
                    col.style.height = this.contentHeight;
                    col.style.width = this.contentWidth;
                    col.style.paddingTop = this.contentPadding;
                    col.style.paddingRight = this.contentPadding;

                    for (let k = 0; k < this.contentDepthNum; k++){
                        let dep = document.createElement('div');
                        dep.classList.add(this.depClass, 'carousel3dDep');
                        dep.setAttribute('id', this.rootid + '_' + (i * this.contentWidthNum*this.contentDepthNum + j*this.contentDepthNum + k).toString() + '_');
                        dep.style.width = this.contentWidth;
                        dep.style.height = this.contentHeight;
                        dep.style.zIndex = (k%this.contentDepthNum).toString();
                        dep.style.top = (this.overlapGap*k).toString() + '%';
                        dep.style.left = (-this.overlapGap*k).toString() + '%';
                        let img = document.createElement('img');
                        img.classList.add('carousel3dContent');
                        img.setAttribute('src', contentList[i * this.contentWidthNum*this.contentDepthNum + j*this.contentDepthNum + k]);
                        dep.appendChild(img);
                        col.appendChild(dep);
                    }
                    row.appendChild(col);
                }
                root.appendChild(row);
            }
        } else {
            // let root = document.getElementById(this.rootid);
            // let colC = root.getElementsByClassName('carousel3dCol');
            // let rowC = root.getElementsByClassName('carousel3dRow');
            // for (let k = 0; k < colC.length; k++) {
            //     let col = colC[k];
            //     col.classList.add(this.colClass);
            //     col.setAttribute('id', this.rootid + '_' + k.toString() + '_');
            //     col.style.width = this.contentWidth;
            //     col.style.height = this.contentHeight;
            // }
            //
            // for (let k = 0; k < rowC.length; k++) {
            //     let row = rowC[k];
            //     row.classList.add(this.rowClass);
            // }
        }

        this.initMove();
        if (this.useView) {
            let target = document.getElementById(this.target2id()).firstChild.cloneNode(true);
            document.getElementById(this.viewid).appendChild(target);
        }
        this.moveEventInit();
        // this.dragEventInit();
        // this.flickEventInit();
        if (this.useController) {
            this.addController()
        }
        this.moveRelativeDepth(0)
    }

    target2id() {
        return this.rootid + '_' + (this.targetY * this.contentWidthNum*this.contentDepthNum + this.targetX * this.contentDepthNum + this.targetZ).toString() + '_'
    }

    setProperty(property) {
        this.contentWidthNum = property.contentWidthNum;
        this.contentHeightNum = property.contentHeightNum;
        this.contentDepthNum = property.contentDepthNum;
        this.contentWidth = property.contentWidth;
        this.contentHeight = property.contentHeight;
        this.targetX = property.targetX;
        this.contentPadding = property.contentPadding;
        this.targetY = property.targetY;
        this.targetZ = property.targetZ;
        this.useView = property.useView;
        this.overlapGap = property.overlapGap;
        this.overlapVisible = property.overlapVisible;
        this.useController = property.useController;
    }

    initMove() {
        let root = document.getElementById(this.rootid);
        let col = document.getElementsByClassName(this.colClass);
        let dep = document.getElementsByClassName(this.depClass);

        //  calculates the initial amount of move
        let mainW = root.clientWidth;
        let mainH = root.clientHeight;
        let contentW = col[0].clientWidth;
        let contentH = col[0].clientHeight;
        let x = ((mainW - contentW) / 2 - contentW * this.targetX) / contentW;
        let y = ((mainH - contentH) / 2 - contentH * this.targetY) / contentH;

        // Move element
        for (let i = 0; i < col.length; i++) {
            col[i].style.transform = `translate3d(${this.positionX + x * 100}%, ${this.positionY + y * 100}%, 0)`;
        }

        // All content are transparent
        // for (let i = 0; i < dep.length; i++) {
        //     dep[i].style.opacity = '0.3';
        // }

        // Init position set
        this.positionX = x * 100;
        this.positionY = y * 100;
        // Target is not transparent
        let a = document.getElementById(this.target2id());
        a.style.opacity = '1';
    }

    moveRelative(x, y) {
        // Boundary normalization
        if (this.isOverTargetIndex(x, y)) return;

        let col = document.getElementsByClassName(this.colClass);
        let dep = document.getElementsByClassName(this.depClass);

        // Move Element
        for (let i = 0; i < col.length; i++) {
            col[i].style.transform = `translate3d(${this.positionX + x * 100}%, ${this.positionY + y * 100}%, 0)`;
        }

        // All content are transparent
        // for (let i = 0; i < dep.length; i++) {
        //     dep[i].style.opacity = '0.3';
        // }

        // Set property
        this.positionX = this.positionX + x * 100;
        this.positionY = this.positionY + y * 100;
        this.targetX = this.targetX - x;
        this.targetY = this.targetY - y;

        // Fire MoveEvent
        document.getElementById(this.rootid).dispatchEvent(this.moveEvent);
    }

    moveRelativeDepth(z){
        // Boundary normalization
        if (this.targetZ - z < 0 || this.targetZ - z >= this.contentDepthNum) return;

        this.targetZ = this.targetZ - z;
        let dep = document.getElementsByClassName(this.depClass);
        let col = document.getElementsByClassName(this.colClass);

        // All content are transparent
        // for (let i = 0; i < dep.length; i++) {
        //     dep[i].style.opacity = '0.3';
        // }

        // Move content
        for (let i = 0; i < col.length; i++) {
            col[i].style.transform = `translate3d(${this.positionX - z * this.overlapGap}%, ${this.positionY + z * this.overlapGap}%, 0)`;
        }

        // transparent change depending on depth
        for (let i = 0; i < dep.length; i++) {
            if (i%this.contentDepthNum > this.targetZ ){  // In front of Target layer
                dep[i].style.visibility = 'hidden';
            } else if (i%this.contentDepthNum > this.targetZ - this.overlapVisible){   // Between the Target layer and overlapVisible layer
                dep[i].style.visibility = 'visible';
                dep[i].style.opacity = (1-(this.targetZ - i%this.contentDepthNum)/this.overlapVisible).toString();
            } else{  // Behind overlapVisible layer
                dep[i].style.visibility = 'hidden';
            }
        }

        // Set property
        this.positionX = this.positionX - z * this.overlapGap;
        this.positionY = this.positionY + z * this.overlapGap;

        // Fire MoveEvent
        document.getElementById(this.rootid).dispatchEvent(this.moveEvent);
    }

    moveAbsolute(x, y) {
        let moveX = this.targetX - x;
        let moveY = this.targetY - y;
        this.moveRelative(moveX, moveY)
    }

    moveLeft() {
        this.moveRelative(1, 0)
    }

    moveRight() {
        this.moveRelative(-1, 0)
    }

    moveUp() {
        this.moveRelative(0, 1)
    }

    moveDown() {
        this.moveRelative(0, -1)
    }

    isOverTargetIndex(x, y) {
        let ntx = this.targetX - x;
        let nty = this.targetY - y;
        return ntx < 0 || ntx > this.contentWidthNum - 1 || nty < 0 || nty > this.contentHeightNum - 1;
    }

    // Define moveEvent
    moveEventInit() {
        this.moveEvent = new Event(this.moveEventid);
        document.getElementById(this.rootid).addEventListener(this.moveEventid, () => {
            // Target is not transparent
            let a = document.getElementById(this.target2id());
            a.style.opacity = '1';
            // Change View
            if (this.useView) {
                // Remove existing contentRemove existing content
                let p = document.getElementById(this.viewid);
                // Add targeted content
                p.removeChild(p.firstChild);
                let target = document.getElementById(this.target2id()).firstChild.cloneNode(true);
                p.appendChild(target)
            }
        });
    }

    addController() {
        let root = document.getElementById(this.rootid);
        let left = document.createElement('div');
        left.classList.add('carousel3dController-left', 'carousel3dController');
        left.onclick = () => this.moveLeft();
        let right = document.createElement('div');
        right.classList.add('carousel3dController-right', 'carousel3dController');
        right.onclick = () => this.moveRight();
        let up = document.createElement('div');
        up.classList.add('carousel3dController-up', 'carousel3dController');
        up.onclick = () => this.moveUp();
        let down = document.createElement('div');
        down.classList.add('carousel3dController-down', 'carousel3dController');
        down.onclick = () => this.moveDown();
        root.appendChild(left);
        root.appendChild(right);
        root.appendChild(down);
        root.appendChild(up);
    }

    // dragEventInit() {
    //     let root = document.getElementById(this.rootid);
    //     root.addEventListener("mousedown", e => {
    //         this.mouseFlag = true;
    //         this.startX = e.clientX;
    //         this.startY = e.clientY;
    //         this.diffX = 0;
    //         this.diffY = 0;
    //         this.tgX = this.targetX;
    //         this.tgY = this.targetY;
    //         // Turn off animation
    //         let col = document.getElementsByClassName(this.colClass);
    //         for (let i = 0; i < col.length; i++) {
    //             col[i].style.transition = 'transform 0s, opacity 0s';
    //         }
    //         e.preventDefault()
    //     });
    //
    //     root.addEventListener("mousemove", e => {
    //         if (!this.mouseFlag) return;
    //         // Countermeasures that become 0 when the mouse on
    //         this.diffX = -this.startX + e.clientX;
    //         this.diffY = -this.startY + e.clientY;
    //         // Animation
    //         let col = document.getElementsByClassName(this.colClass);
    //         let contentW = col[0].clientWidth;
    //         let contentH = col[0].clientHeight;
    //         for (let i = 0; i < col.length; i++) {
    //             col[i].style.transform = `translate3d(${this.positionX}%, ${this.positionY}%, 0) translate3d(${this.diffX}px, ${this.diffY}px, 0)`;
    //             col[i].style.opacity = '0.3';
    //         }
    //         this.targetX = this.tgX - Math.round(this.diffX / contentW);
    //         this.targetY = this.tgY - Math.round(this.diffY / contentH);
    //         document.getElementById(this.rootid).dispatchEvent(this.moveEvent);
    //     });
    //
    //     root.addEventListener("mouseup", e => {
    //         this.mouseFlag = false;
    //         this.targetX = this.tgX;
    //         this.targetY = this.tgY;
    //         let col = document.getElementsByClassName(this.colClass);
    //         let contentW = col[0].clientWidth;
    //         let contentH = col[0].clientHeight;
    //         // Turn on animation
    //         for (let i = 0; i < col.length; i++) {
    //             col[i].style.transform = `translate3d(${this.positionX}%, ${this.positionY}%, 0)`;
    //             col[i].style.transition = '';
    //         }
    //         // Calculation of actual move distance
    //         let moveX = Math.round(this.diffX / contentW);
    //         let moveY = Math.round(this.diffY / contentH);
    //         // little drag
    //         if (moveX === 0 && moveY === 0){
    //             if (Math.abs(this.diffX) > contentW / 10) moveX = Math.sign(this.diffX);
    //             if (Math.abs(this.diffY) > contentH / 10) moveY = Math.sign(this.diffY);
    //         }
    //         // single click
    //         if (moveX === 0 && moveY === 0) {
    //             // id to num (ex. rootid_num_ -> num)
    //             let clickId = e.target.parentElement.getAttribute('id').replace(this.rootid, '').slice(1, -1);
    //             // content click
    //             if (clickId) {
    //                 let i = Math.floor(clickId / this.contentWidthNum);
    //                 let j = clickId % this.contentWidthNum;
    //                 this.moveAbsolute(j, i)
    //             }
    //             // Do nothing when clicking non-content(eg. controller, margin)
    //         } else { // drag
    //             this.moveRelative(moveX, moveY);
    //         }
    //     })
    // }
    // flickEventInit(){
    //     console.log('aaa');
    //     let root = document.getElementById(this.rootid);
    //     root.addEventListener("touchstart", e => {
    //         this.startX = e.touches[0].pageX;
    //         this.startY = e.touches[0].pageY;
    //         e.preventDefault()
    //     });
    //     root.addEventListener("touchmove", e => {
    //         this.diffX = e.changedTouches[0].pageX - this.startX;
    //         this.diffY = e.changedTouches[0].pageY - this.startY;
    //     });
    //     root.addEventListener("touchend", () => {
    //         let moveX = 0;
    //         let moveY = 0;
    //         if (Math.abs(this.diffX) > parseInt(this.contentWidth) / 10) moveX = Math.sign(this.diffX);
    //         if (Math.abs(this.diffY) > parseInt(this.contentHeight) / 10) moveY = Math.sign(this.diffY);
    //         this.moveRelative(moveX, moveY);
    //     })
    //
    //
    // }

}
