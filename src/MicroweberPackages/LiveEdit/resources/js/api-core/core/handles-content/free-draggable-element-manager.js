import MicroweberBaseClass from "../../services/containers/base-class";
import { DomService } from "../classes/dom";
import { ElementManager } from "../classes/element";
import { ResizableInfo } from "../classes/resizable";






export class FreeDraggableElementManager extends MicroweberBaseClass {


    constructor() {
        super();

        mw.app.on('onLiveEditReady', event => {
            this.init();
        });

    }


    static getStyle(node){
        const res = {};
        if(!node || node.nodeType !== 1) {
            return res
        }

        let i = 0, l = node.style.length;

        for ( ; i < l; i++ ) {
            const prop = node.style[i];
            if(prop.indexOf('--') !== -1) {
                continue;
            }
            res[prop] = node.style.getPropertyValue(prop)
        }

        return res;
    }

    static toPercent(node, container){
        return;
        if(!node || node.nodeType !== 1) {
            return
        }
        if(!container) {
            container = mw.tools.firstParentOrCurrentWithAnyOfClasses(node, ['mw-layout-container'])
        }
        if(!container) {
            return
        }
        const containerOff = container.getBoundingClientRect();
        const el = ElementManager(node);
        const off = getComputedStyle(node);
        el.css({
            left: ((parseFloat(off.left) / containerOff.width) * 100) + '%',
            top: ((parseFloat(off.top) / containerOff.height) * 100) + '%',
        })

    }

    static toPixel(node){
        return;

        if(!node || node.nodeType !== 1) {
            return
        }

        const el = ElementManager(node);

        const css = getComputedStyle(node);


        el.css({
            left: css.left,
            top: css.top,
            /*width: css.width,
            height: css.height,*/
        })

    }


    static getTargetNode(node) {
        if(!node) {
            return
        }
        if(node.nodeType !== 1) {
            node =  node.parentNode;
        }
        if(!node) {
            return
        }
        return mw.tools.firstParentOrCurrentWithAnyOfClasses(node, ['element', 'module'])
    }


    static getElementContainer(node) {
        if(!node) {
            return
        }
        if(node.nodeType !== 1) {
            node =  node.parentNode;
        }
        if(!node) {
            return
        }

        return mw.tools.firstParentOrCurrentWithAnyOfClasses(node, ['mw-layout-container'])
    }

    static getLayoutContainer(layout) {
        if(!layout || layout.nodeType !== 1) {
            return
        }

        return layout.classList.contains('mw-layout-container') ? layout : layout.querySelector('.mw-layout-container')

    }


    static saveLayoutHeight(layout) {
        if(!layout || layout.nodeType !== 1) {
            return
        }
        const container = layout.classList.contains('mw-layout-container') ? layout : layout.querySelector('.mw-layout-container');
        if(!container ) {
            return
        }
        const css = { };

        if(container.style.height){
            css['height'] = container.style.height;
        }
        if(container.style.minHeight){
            css['min-height'] = container.style.minHeight;
        }
        mw.top().app.cssEditor.style(container, css);
    }
    setLayoutHeight(layout) {
        if(!layout || layout.nodeType !== 1) {
            return
        }
        const container = layout.classList.contains('mw-layout-container') ? layout : layout.querySelector('.mw-layout-container');
        if(!container) {
            return
        }

        const containerOff = ElementManager(container).offset();

        mw.app.dispatch('liveEditRefreshHandlesPosition');

        let containerheight = 50;

        container.querySelectorAll('.element,.module').forEach(node => {
            if(node.className.indexOf('moveable-') !== -1) {
                return;
            }


                const el = ElementManager(node);
                const off = ElementManager(node).offset();

                if(((off.offsetTop - containerOff.offsetTop) + off.height) > containerheight) {
                    containerheight = (off.offsetTop - containerOff.offsetTop) + off.height;
                }


        });

        container.style.height = containerheight + 'px';
        container.__autoLayoutHeight = containerheight ;

    }

    freeLayoutNodes(layout) {
        if(!layout || layout.nodeType !== 1) {
            return
        }
        const container = layout.querySelector('.mw-layout-container');
        if(!container) {
            return
        }

        container.style.position = 'relative';

        const containerOff = ElementManager(container).offset();


        let containerheight = 50;


        const toBeFree = [];


        container.querySelectorAll('.element,.module').forEach(node => {

                if(node.querySelector('.element,.module')) {
                    return
                }


                const el = ElementManager(node);
                const off = ElementManager(node).offset();

                if(((off.offsetTop - containerOff.offsetTop) + off.height) > containerheight) {
                    containerheight = (off.offsetTop - containerOff.offsetTop) + off.height;
                }

                toBeFree.push({
                    el, node,
                    css: {
                        top: off.offsetTop - containerOff.offsetTop,
                        left: off.offsetLeft - containerOff.offsetLeft,
                        width: off.width,
                        maxWidth: '100%',
                        height: off.height,
                        position: 'absolute'
                    }
                })





        })
        container.style.height = containerheight + 'px';
        toBeFree.forEach(obj => {
            obj.el.css(obj.css);
            container.append(obj.el.get(0))
            this.makeFreeDraggableElement(obj.node, container)
        })

    }

    static getFirstFreeNode(element) {
        if(!element) {
            return;
        }
        while (element) {
            if(element.dataset && element.dataset.mwFreeElement === 'true') {
                return element;
            }
            element = element.parentNode
        }

    }

    #adapters = {

        movable: function(element, container, scope) {



            const draggable = true;
            const throttleDrag = 1;
            const edgeDraggable = false;
            const startDragRotate = 0;
            const throttleDragRotate = 0;



            const Mvb = mw.top().app.canvas.getWindow().Moveable;

            if(!Mvb.mw) {
                Mvb.mw = {};
                Mvb.mw._movables = [];

                mw.top().app.liveEdit.handles.get('element').on('targetChange', node => {

                    Mvb.mw._movables.forEach(instance => {
                        instance.selfElement.style.display = 'none';
                    });

                    const free = FreeDraggableElementManager.getFirstFreeNode(node)
                    if(free && free.__mw_movable) {
                        free.__mw_movable.selfElement.style.display = 'block';
                    }


                })
                mw.top().app.liveEdit.handles.get('module').on('targetChange', node => {
                    Mvb.mw._movables.forEach(instance => {
                        instance.selfElement.style.display = 'none';
                    })
                    const free = FreeDraggableElementManager.getFirstFreeNode(node)
                    if(free && free.__mw_movable) {
                        free.__mw_movable.selfElement.style.display = 'block';
                    }
                })
            }

            if(!element || element.__mw_movable) {
                return;
            }


            const mvb = new Mvb(container, {
                target: element,

                draggable: draggable,
                throttleDrag: throttleDrag,
                edgeDraggable: edgeDraggable,
                startDragRotate: startDragRotate,
                throttleDragRotate: throttleDragRotate,
                resizable: true,
                rotatable: true,
                selectable: true,
                snappable: true,
                scalable: false,
                snapContainer: container,

                /*
                snapRotataionThreshold: 5,
                snapRotationDegrees: [0, 90, 180, 270], */

                isDisplaySnapDigit: true,
                isDisplayInnerSnapDigit: true,
                snapGap: true,
                snapDirections: {"top":true,"left":true,"bottom":true,"right":true,"center":true,"middle":true},
                elementSnapDirections: {"top":true,"left":true,"bottom":true,"right":true,"center":true,"middle":true},
                snapThreshold: true,
                elementGuidelines: [".element", ".module", ".container", '.mw-layout-container'],
                hideDefaultLines: false,


                // radius
                roundable: false,
                isDisplayShadowRoundControls: "horizontal",
                roundClickable: "control",
                roundPadding: 15

             });


             Mvb.mw._movables.push(mvb);


             mvb.__mwlisteners = [];

             const keyPress = e => {
                if(element.offsetHeight < element.scrollHeight) {
                    element.style.height =  element.scrollHeight + 'px';
                }
             }

             mvb.__mwlisteners.push({
                name: 'keyPress',
                handle: keyPress
             })


             element.__mw_movable = mvb;
             element.addEventListener('keyPress', keyPress) ;

             mvb.selfElement.style.display = 'none';
             mvb.selfElement.classList.add('no-element');

             mvb.info = new ResizableInfo({
                element: mvb.selfElement.querySelector('.moveable-s')
             })

          ;



            const beforeChange = (e) => {
                container.querySelectorAll('[data-mw-free-element]').forEach(node => {
                    // if(node !== e.target){
                        FreeDraggableElementManager.toPixel(node);
                    // }
                 });
                 if(element.nodeName === 'IMG' && getComputedStyle(element).objectFit === 'fill'){
                    mw.top().app.cssEditor.style(element, {
                        'object-fit': 'contain'
                    });
                 }
            }
            const afterChanged = (e) => {


                container.querySelectorAll('[data-mw-free-element]').forEach(node => {
                    FreeDraggableElementManager.toPercent(node);
                    mw.top().app.cssEditor.style(node, FreeDraggableElementManager.getStyle(node));
                    node.removeAttribute('style')
                });

                FreeDraggableElementManager.saveLayoutHeight(container);

                mvb.info.hide()

                mw.app.registerChangedState(container);
                mw.app.dispatch('liveEditRefreshHandlesPosition');
            }

            mvb.on("dragStart", beforeChange)
            mvb.on("resizeStart", beforeChange)
            mvb.on("rotateStart", beforeChange)

            mvb.on("dragEnd", afterChanged)
            mvb.on("resizeEnd", afterChanged)
            mvb.on("rotateEnd", afterChanged)

             mvb.on("drag", e => {



                e.target.style.transform = e.transform

                 mw.top().app.liveEdit.handles.hide();
                 mw.app.liveEdit.pause();
                 scope.setLayoutHeight(container)
             });
             mvb.on("scale", e => {

                e.target.style.transform = e.transform;
             })
             mvb.on("resize", e => {
                const heightProp = e.target.nodeName !== 'IMG' ? 'height' : 'height'
                e.target.style.width = `${e.width}px`;
                e.target.style.height = `auto`;
                e.target.style[heightProp] = `${e.height}px`;
                // e.target.style.transform = 'none';





                e.target.style.transform =  e.transform




                mw.top().app.liveEdit.handles.hide();
                mw.app.liveEdit.pause();
                scope.setLayoutHeight(container)
                mvb.info.show(`${e.width}x${e.height}`)
            });
            mvb.on("rotate", e => {
                e.target.style.transform = e.drag.transform;
                mw.top().app.liveEdit.handles.hide();
                mw.app.liveEdit.pause();
                scope.setLayoutHeight(container)
            });
        }
    }

    freeElement(element, container = null) {
        const adapter = 'movable';


        if(!element) {
            return;
        }

        if(!container) {
            container = FreeDraggableElementManager.getElementContainer(element);
        }

        const css = getComputedStyle(element);
        if(css.position === 'static') {
            element.style.position = 'absolute';
            element.style.top = container.offsetHeight/2 - element.offsetHeight/2 + 'px';
            element.style.left = container.offsetWidth/2 - element.offsetWidth/2 + 'px';
        }


        this.#adapters[adapter](element, container, this);
        element.dataset.mwFreeElement = true;
    }

    makeFreeDraggableElement(element, container = null) {
        this.freeElement(element, container);
        mw.app.dispatch('liveEditRefreshHandlesPosition');
    }

    init() {
        mw.top().app.canvas.getDocument().querySelectorAll('[data-mw-free-element="true"]').forEach(node => this.freeElement(node));
        this.initLayouts();
        mw.top().app.on('moduleInserted', () => {

            setTimeout( () => {
                this.initLayouts();
            }, 300);
        })
    }

    initLayouts() {
        const Mvb = mw.top().app.canvas.getWindow().Moveable;
        mw.top().app.canvas.getDocument().querySelectorAll('.mw-free-layout-container').forEach(node => {


            if(node.__layoutReady) {
                return;
            }
            node.__layoutReady = true;
            const resizer = new Resizable({
                element: node,
                document: node.ownerDocument,
                direction: 'vertical',
                heightProp: height => {
                    node.style.minHeight = Math.max(height, node.__autoLayoutHeight ? node.__autoLayoutHeight : 100 ) + 'px';
                },
            });

            resizer.on('ready', () => {
                if(!resizer.handles){
                    return;
                }
                resizer.handles.top.style.display = 'none';
                resizer.handles.right.style.display = 'none';

                resizer.handles.left.style.display = 'none';
            });

            resizer.mount();




            ElementManager(resizer.handles.bottom ).css({
                'width': '35px',
                'height': '35px',
                'background': '#0078ff',
                'right': '10%',
                'bottom': '25px',
                'left': 'auto',
                'padding': '8px',
                'border-radius': '5px',
            }).html(`
            <svg height="19px" width="19px" version="1.1"   xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 349.455 349.455" xml:space="preserve">
                <path style="fill:#ffffff;" d="M248.263,240.135c-1.407-1.407-3.314-2.197-5.304-2.197c-1.989,0-3.896,0.79-5.304,2.197
                    l-45.429,45.429l0.001-221.673l45.428,45.429c1.407,1.407,3.314,2.197,5.304,2.197c1.989,0,3.896-0.79,5.304-2.197l14.143-14.143
                    c1.406-1.406,2.196-3.314,2.196-5.303c0-1.989-0.79-3.897-2.196-5.303L180.032,2.197C178.625,0.79,176.717,0,174.728,0
                    c-1.989,0-3.896,0.79-5.304,2.197L87.049,84.573c-1.406,1.407-2.196,3.314-2.196,5.303c0,1.989,0.79,3.897,2.197,5.304
                    l14.143,14.142c1.464,1.464,3.384,2.196,5.303,2.196c1.919,0,3.839-0.732,5.304-2.197l45.429-45.43l-0.001,221.673l-45.428-45.429
                    c-1.407-1.407-3.314-2.197-5.304-2.197c-1.989,0-3.896,0.79-5.304,2.197l-14.143,14.143c-1.406,1.406-2.196,3.314-2.196,5.303
                    c0,1.989,0.79,3.897,2.196,5.303l82.374,82.374c1.465,1.464,3.385,2.197,5.304,2.197c1.919,0,3.839-0.733,5.304-2.197l82.375-82.375
                    c1.406-1.406,2.196-3.314,2.196-5.303c0-1.989-0.79-3.897-2.196-5.303L248.263,240.135z"/>
            </svg>
            `)



            resizer.on('resizeStart', () => {
                document.body.classList.add('mw-live--layout-resizing');
                mw.top().app.liveEdit.handles.hide();
                mw.app.liveEdit.pause();
            });



            resizer.on('resizeStop', () => {



                FreeDraggableElementManager.saveLayoutHeight(node);

                document.body.classList.remove('mw-live--layout-resizing');

                mw.app.liveEdit.play();
            })

           /* const mvb = new Mvb(node, {
                target: node,

                draggable: false,

                resizable: false,
                rotatable: false,
                selectable: false,
                snappable: false,
                scalable: false,
                snapContainer: false,


                hideDefaultLines: true,

                roundable: false,


             });*/
        })
    }

    static destroyFreeDraggableElement(element) {

        if(element.__mw_movable){
            var i = element.ownerDocument.defaultView.mw._movables.indexOf(mvb);
            if(i > -1) {
                element.ownerDocument.defaultView.mw._movables.splice(i, 1)
            }
            if(element.__mw_movable.__mwlisteners){
                element.__mw_movable.__mwlisteners.forEach(l => {
                    element.removeEventListener(l.name, l.handle)
                })
            }
            element.__mw_movable.destroy();
            element.__mw_movable = null;

            delete element.dataset.mwFreeElement;
        }


    }

}
