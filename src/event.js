import * as THREE from 'three';

/**
 * Base on EventDispatcher implement click event
 */

export function initEvent( { scene, camera } ) {

	initClickEvent( { scene, camera } );
	initHoverEvent( { scene, camera } );

}

export function useClick( callback, mesh ) {

	if ( Array.isArray( mesh ) ) {

		mesh.forEach( m => initClickMesh( m ) );

	} else {

		mesh && initClickMesh( mesh );

	}

	function initClickMesh( mesh ) {

		mesh.addEventListener( 'click', ( event ) => {

			callback && callback( event );

		} );

	}

}

export function useHover( callback, mesh ) {

	if ( Array.isArray( mesh ) ) {

		mesh.forEach( m => initHoverMesh( m ) );

	} else {

		mesh && initHoverMesh( mesh );

	}

	function initHoverMesh( mesh ) {

		let returnCallback = undefined;
		mesh.addEventListener( 'mouseenter', ( event ) => {

			returnCallback = callback( event );

		} );
		mesh.addEventListener( 'mouseleave', ( event ) => {

			returnCallback && returnCallback( event );

		} );

	}

}

export function initClickEvent( { scene, camera } ) {

	let isMouseClick = false;

	let intersects;
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();

	function intersectObjects( objects ) {

		raycaster.setFromCamera( mouse, camera );
		intersects = raycaster.intersectObjects( objects );

	}

	function onMouseDown() {

		isMouseClick = true;

	}

	function onMouseUp() {

		if ( isMouseClick ) {

			dispatchEvent( 'click' );

		}

		isMouseClick = false;

	}

	function dispatchEvent( type ) {

		for ( let i = 0; i < intersects.length; i ++ ) {

			const object = intersects[ i ].object;
			object.dispatchEvent( { type } );

		}

	}

	function onMouseMove( event ) {

		isMouseClick = false;

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		intersectObjects( scene.children );

	}

	window.addEventListener( 'mousedown', onMouseDown, false );
	window.addEventListener( 'mouseup', onMouseUp, false );
	window.addEventListener( 'mousemove', onMouseMove, false );

}

export function initHoverEvent( { scene, camera } ) {

	let intersects = [];
	const intersectsMap = {};
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();

	function intersectObjects( objects ) {

		raycaster.setFromCamera( mouse, camera );
		const _intersects = raycaster.intersectObjects( objects );

		const newLength = _intersects.length;
		const oldLength = intersects.length;

		intersects = _intersects;

		if ( newLength > oldLength ) {

			dispatchMouseEnter();

		}

		if ( newLength < oldLength ) {

			dispatchMouseLeave();

		}


	}


	function dispatchMouseEnter() {

		for ( let i = 0; i < intersects.length; i ++ ) {

			const object = intersects[ i ].object;
			const id = object.id;

			if ( ! intersectsMap[ id ] ) {

				intersectsMap[ id ] = object;
				object.dispatchEvent( { type: 'mouseenter' } );

			}

		}

	}

	function dispatchMouseLeave() {

		const delete_keys = {};

		for ( let i = 0; i < intersects.length; i ++ ) {

			const object = intersects[ i ].object;
			const id = object.id;
			delete_keys[ id ] = true;

		}

		for ( const key in intersectsMap ) {

			if ( ! delete_keys[ key ] ) {

				const object = intersectsMap[ key ];
				object.dispatchEvent( { type: 'mouseleave' } );
				delete intersectsMap[ key ];

			}

		}

	}

	function onMouseMove( event ) {

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		intersectObjects( scene.children );

	}

	window.addEventListener( 'mousemove', onMouseMove, false );

}
