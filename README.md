# three-event

```javascript
import { initEvent, useClick, useHover } from 'three-event.js';

initEvent( { scene, camera } );

// click event

mesh.addEventListener( 'click', ( { target } ) => {

    target.material.color.set( Math.random() * 0xffffff );

} );

// hover event

mesh.addEventListener( 'mouseenter', ( { target } ) => {

    target.material.color.set( 0xff0000 );

} );
mesh.addEventListener( 'mouseleave', ( { target } ) => {

    target.material.color.set( 0x00ff00 );

} );

// click event

useClick( ( { target } ) => {

    target.material.color.set( Math.random() * 0xffffff );

}, mesh );

// hover event

useHover( ( { target } ) => {

    target.material.color.set( 0xff0000 );

    return ( { target } ) => {

        target.material.color.set( 0x00ff00 );

    };

}, mesh );
```