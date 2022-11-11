"use strict";

import * as THREE from "../three/build/three.module.js";
import {Color} from "../three/build/three.module.js";

export default class CustomPhongMaterial extends THREE.ShaderMaterial {

  constructor({
    color = 0xffffff, map = null,
  } = {}) {

    // Setup our uniforms object:
    // If you want to keep the functionality of a built-in material you have to add the appropriate uniforms.
    // You can find the uniforms for built-in shaders here:
    // https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderLib.js
    let uniforms = THREE.UniformsUtils.merge([
      THREE.ShaderLib.phong.uniforms,
      {
        // custom uniforms:
        time: { value: 0.0 },
        warpSpeed: { value: 1.0 },
        translationIntensity: { value: 1.0 },
        rotationIntensity: { value: 1.0 },
        verticalWarp: { value: 1.0 },
        horizontalWarp: { value: 1.0 },
      },
    ]);
    uniforms.diffuse.value.setHex(color);

    super({
      fragmentShader: FRAGMENT_SHADER,
      uniforms: uniforms,
      fog: true,
      lights: true,
    });

    this.vertexShader = this.VERTEX_SHADER();
  }

  VERTEX_SHADER() { return glsl`
#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

uniform float time;
uniform float warpSpeed;
uniform float translationIntensity;
uniform float rotationIntensity;
uniform float horizontalWarp;
uniform float verticalWarp;

void main() {
	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	
	vec4 worldPos = vec4( transformed, 1.0 );
	worldPos = modelMatrix * worldPos;
	vec3 relativePos = vec3(worldPos.x - cameraPosition.x, worldPos.y - cameraPosition.y, worldPos.z - cameraPosition.z);
	
	float distance = sqrt(relativePos.x * relativePos.x + relativePos.y * relativePos.y + relativePos.z * relativePos.z);
	float timeDelta = time * warpSpeed / 10.0;
	float tDistance = distance * translationIntensity;
	float rDistance = distance * rotationIntensity;
	
	relativePos.x += horizontalWarp * tDistance / 10.0 * sin(sin(timeDelta / 112.90 + 1.35) * tDistance / 8.66 + 9.71 * sin(timeDelta / 9.13 + 1.82) + 2.91) * (0.5 + sin(timeDelta / 10.73 + 1.09) / 2.0);
	relativePos.y += verticalWarp * tDistance / 10.0 * sin(sin(timeDelta / 99.29 + 0.23) * tDistance / 11.50 + 8.38 * sin(timeDelta / 10.50 + 0.20) + 1.37) * (0.5 + sin(timeDelta / 10.41 + 0.65) / 2.0);
	relativePos.z += horizontalWarp * tDistance / 10.0 * sin(sin(timeDelta / 112.84 + 3.13) * tDistance / 9.12 + 8.61 * sin(timeDelta / 9.82 + 1.15) + 0.68) * (0.5 + sin(timeDelta / 9.58 + 0.99) / 2.0);
	
	float rx0 = sqrt(horizontalWarp * verticalWarp) * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 104.49 + 0.11) * rDistance / 10.14 + 11.07 * sin(timeDelta / 9.59 + 0.18) + 1.67) * (0.5 + sin(timeDelta / 8.35 + 2.89) / 2.0);
	relativePos.y = relativePos.y * cos(rx0) + relativePos.z * sin(rx0);
	relativePos.z = relativePos.z * cos(rx0) - relativePos.y * sin(rx0);
	float ry0 = horizontalWarp * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 114.13 + 0.17) * rDistance / 10.05 + 11.51 * sin(timeDelta / 9.16 + 0.08) + 1.76) * (0.5 + sin(timeDelta / 10.94 + 0.05) / 2.0);
	relativePos.z = relativePos.z * cos(ry0) + relativePos.x * sin(ry0);
	relativePos.x = relativePos.x * cos(ry0) - relativePos.z * sin(ry0);
	float rz0 = sqrt(horizontalWarp * verticalWarp) * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 107.04 + 3.12) * rDistance / 10.42 + 11.59 * sin(timeDelta / 10.82 + 1.94) + 2.44) * (0.5 + sin(timeDelta / 9.31 + 1.12) / 2.0);
	relativePos.x = relativePos.x * cos(rz0) + relativePos.y * sin(rz0);
	relativePos.y = relativePos.y * cos(rz0) + relativePos.x * sin(rz0);
	float ry1 = horizontalWarp * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 84.34 + 2.20) * rDistance / 11.70 + 10.95 * sin(timeDelta / 9.56 + 2.24) + 1.85) * (0.5 + sin(timeDelta / 8.78 + 0.87) / 2.0);
	relativePos.z = relativePos.z * cos(ry1) + relativePos.x * sin(ry1);
	relativePos.x = relativePos.x * cos(ry1) - relativePos.z * sin(ry1);
	float rz1 = sqrt(horizontalWarp * verticalWarp) * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 100.18 + 2.52) * rDistance / 10.03 + 9.83 * sin(timeDelta / 10.71 + 2.29) + 0.61) * (0.5 + sin(timeDelta / 10.67 + 1.73) / 2.0);
	relativePos.x = relativePos.x * cos(rz1) + relativePos.y * sin(rz1);
	relativePos.y = relativePos.y * cos(rz1) + relativePos.x * sin(rz1);
	float rx1 = sqrt(horizontalWarp * verticalWarp) * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 112.57 + 2.90) * rDistance / 9.65 + 10.59 * sin(timeDelta / 9.71 + 2.65) + 2.47) * (0.5 + sin(timeDelta / 10.17 + 2.11) / 2.0);
	relativePos.y = relativePos.y * cos(rx1) + relativePos.z * sin(rx1);
	relativePos.z = relativePos.z * cos(rx1) - relativePos.y * sin(rx1);
	float rz2 = sqrt(horizontalWarp * verticalWarp) * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 112.05 + 0.91) * rDistance / 11.61 + 11.03 * sin(timeDelta / 9.13 + 1.27) + 1.60) * (0.5 + sin(timeDelta / 11.34 + 1.57) / 2.0);
	relativePos.x = relativePos.x * cos(rz2) + relativePos.y * sin(rz2);
	relativePos.y = relativePos.y * cos(rz2) + relativePos.x * sin(rz2);
	float rx2 = sqrt(horizontalWarp * verticalWarp) * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 108.48 + 0.97) * rDistance / 9.14 + 11.68 * sin(timeDelta / 9.79 + 1.80) + 1.09) * (0.5 + sin(timeDelta / 11.12 + 1.26) / 2.0);
	relativePos.y = relativePos.y * cos(rx2) + relativePos.z * sin(rx2);
	relativePos.z = relativePos.z * cos(rx2) - relativePos.y * sin(rx2);
	float ry2 = horizontalWarp * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 91.29 + 0.14) * rDistance / 10.93 + 10.84 * sin(timeDelta / 11.93 + 0.23) + 0.38) * (0.5 + sin(timeDelta / 10.52 + 3.08) / 2.0);
	relativePos.z = relativePos.z * cos(ry2) + relativePos.x * sin(ry2);
	relativePos.x = relativePos.x * cos(ry2) - relativePos.z * sin(ry2);
	float rz3 = sqrt(horizontalWarp * verticalWarp) * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 82.40 + 2.07) * rDistance / 9.96 + 8.75 * sin(timeDelta / 9.66 + 1.81) + 1.72) * (0.5 + sin(timeDelta / 11.83 + 1.76) / 2.0);
	relativePos.x = relativePos.x * cos(rz3) + relativePos.y * sin(rz3);
	relativePos.y = relativePos.y * cos(rz3) + relativePos.x * sin(rz3);
	float ry3 = horizontalWarp * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 87.49 + 2.59) * rDistance / 10.89 + 8.14 * sin(timeDelta / 9.84 + 0.27) + 3.11) * (0.5 + sin(timeDelta / 8.11 + 1.60) / 2.0);
	relativePos.z = relativePos.z * cos(ry3) + relativePos.x * sin(ry3);
	relativePos.x = relativePos.x * cos(ry3) - relativePos.z * sin(ry3);
	float rx3 = sqrt(horizontalWarp * verticalWarp) * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 112.25 + 2.20) * rDistance / 9.38 + 8.20 * sin(timeDelta / 8.33 + 2.45) + 1.87) * (0.5 + sin(timeDelta / 8.55 + 2.64) / 2.0);
	relativePos.y = relativePos.y * cos(rx3) + relativePos.z * sin(rx3);
	relativePos.z = relativePos.z * cos(rx3) - relativePos.y * sin(rx3);
	float ry4 = horizontalWarp * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 119.42 + 1.96) * rDistance / 9.83 + 11.13 * sin(timeDelta / 10.80 + 1.83) + 1.19) * (0.5 + sin(timeDelta / 8.83 + 1.37) / 2.0);
	relativePos.z = relativePos.z * cos(ry4) + relativePos.x * sin(ry4);
	relativePos.x = relativePos.x * cos(ry4) - relativePos.z * sin(ry4);
	float rx4 = sqrt(horizontalWarp * verticalWarp) * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 113.24 + 1.30) * rDistance / 9.82 + 11.86 * sin(timeDelta / 10.41 + 1.49) + 1.09) * (0.5 + sin(timeDelta / 8.27 + 3.05) / 2.0);
	relativePos.y = relativePos.y * cos(rx4) + relativePos.z * sin(rx4);
	relativePos.z = relativePos.z * cos(rx4) - relativePos.y * sin(rx4);
	float rz4 = sqrt(horizontalWarp * verticalWarp) * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 111.75 + 2.65) * rDistance / 10.60 + 10.56 * sin(timeDelta / 8.80 + 0.54) + 0.71) * (0.5 + sin(timeDelta / 8.65 + 0.77) / 2.0);
	relativePos.x = relativePos.x * cos(rz4) + relativePos.y * sin(rz4);
	relativePos.y = relativePos.y * cos(rz4) + relativePos.x * sin(rz4);
	float rx5 = sqrt(horizontalWarp * verticalWarp) * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 80.48 + 0.74) * rDistance / 10.08 + 10.78 * sin(timeDelta / 11.73 + 1.59) + 1.92) * (0.5 + sin(timeDelta / 11.36 + 1.45) / 2.0);
	relativePos.y = relativePos.y * cos(rx5) + relativePos.z * sin(rx5);
	relativePos.z = relativePos.z * cos(rx5) - relativePos.y * sin(rx5);
	float rz5 = sqrt(horizontalWarp * verticalWarp) * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 102.02 + 1.65) * rDistance / 10.52 + 11.40 * sin(timeDelta / 10.88 + 1.35) + 0.54) * (0.5 + sin(timeDelta / 11.82 + 2.17) / 2.0);
	relativePos.x = relativePos.x * cos(rz5) + relativePos.y * sin(rz5);
	relativePos.y = relativePos.y * cos(rz5) + relativePos.x * sin(rz5);
	float ry5 = horizontalWarp * sqrt(rDistance) / 100.0 * sin(sin(timeDelta / 104.36 + 2.46) * rDistance / 11.02 + 10.13 * sin(timeDelta / 10.02 + 0.30) + 1.45) * (0.5 + sin(timeDelta / 9.69 + 1.32) / 2.0);
	relativePos.z = relativePos.z * cos(ry5) + relativePos.x * sin(ry5);
	relativePos.x = relativePos.x * cos(ry5) - relativePos.z * sin(ry5);
	
	worldPos = vec4( relativePos.x + cameraPosition.x, relativePos.y + cameraPosition.y, relativePos.z + cameraPosition.z, 1.0 );
	worldPos = inverse(modelMatrix) * worldPos;
	transformed = worldPos.xyz;
	
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}
`;}
}

/**
 * Noop tagged template literal for syntax hightlighting.
 */
const glsl = (strings, ...expressions) => {
  let result = strings[0];

  for (let i = 1, l = strings.length; i < l; i++) {
    result += expressions[i - 1];
    result += strings[i];
  }

  return result;
};

const FRAGMENT_SHADER = glsl`
#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}
`;
