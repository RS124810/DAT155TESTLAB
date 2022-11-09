"use strict";

import * as THREE from "../three/build/three.module.js";

export default class CustomTextureSplattingMaterial extends THREE.ShaderMaterial {
  /**
   *
   * @param {Object} options
   * @param {number} options.color
   * @param {number} options.emissive
   * @param {number} options.roughness
   * @param {number} options.metalness
   * @param {THREE.Texture[]} options.colorMaps
   * @param {THREE.Texture[]} options.alphaMaps
   */
  constructor({
    color = 0xffffff,
    emissive = 0x000000,
    roughness = 1.0,
    metalness = 0.0,

    colorMaps = [],
    alphaMaps = [],
  } = {}) {
    if (Math.max(1, colorMaps.length) !== alphaMaps.length + 1) {
      throw Error(
        `There must be exactly one alpha-map less than there are color-maps, found ${colorMaps.length} color-maps and ${alphaMaps.length} alpha-maps.`
      );
    }

    // Setup our uniforms object:
    // If you want to keep the functionality of a built-in material you have to add the appropriate uniforms.
    // You can find the uniforms for built-in shaders here:
    // https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderLib.js
    let uniforms = THREE.UniformsUtils.merge([
      THREE.ShaderLib.standard.uniforms,
      {
        // custom uniforms:
        diffuse: { value: new THREE.Color(color) },
        emissive: { value: new THREE.Color(emissive) },
        roughness: { value: roughness },
        metalness: { value: metalness },

        time: { value: 0.0 },
      },
    ]);

    // Setup defines object:
    // The defines variables are usually used to enable/disable functionality in the glsl shaders.
    let defines = {
      STANDARD: "",
    };

    if (colorMaps.length > 0) {
      uniforms.colorMaps = {
        type: "tv",
        value: colorMaps,
      };

      uniforms.colorMapsUvTransforms = {
        type: "Matrix3fv",
        value: colorMaps.map((texture) => {
          texture.updateMatrix();
          return texture.matrix;
        }),
      };

      uniforms.alphaMaps = {
        type: "tv",
        value: alphaMaps,
      };

      defines.USE_ALPHA_MAPS = "";
      defines.USE_UV = "";

      defines.NUMBER_OF_COLOR_MAPS = colorMaps.length;
      defines.NUMBER_OF_ALPHA_MAPS = alphaMaps.length;
    }

    super({
      vertexShader: VERTEX_SHADER,
      fragmentShader: fragmentShader(colorMaps.length),
      uniforms,
      defines,
      fog: true,
      lights: true,
    });
  }
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

const VERTEX_SHADER = glsl`
#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
  varying vec3 vWorldPosition;
#endif

// Custom:
#ifdef USE_ALPHA_MAPS
  uniform mat3 colorMapsUvTransforms[NUMBER_OF_COLOR_MAPS];
  varying vec2 colorMapsUvs[NUMBER_OF_COLOR_MAPS]; // Pass to fragment shader.
#endif

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

uniform float time;

void main() {
  // Custom:
  #ifdef USE_ALPHA_MAPS
    for (int i = 0; i < NUMBER_OF_COLOR_MAPS; i++) {
        colorMapsUvs[i] = (colorMapsUvTransforms[i] * vec3(uv, 1)).xy;
    }
  #endif
  
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
  
  vec3 relativePos = vec3(transformed.x - cameraPosition.x, transformed.y - cameraPosition.y, transformed.z - cameraPosition.z);
  float distance = sqrt(relativePos.x * relativePos.x + relativePos.y * relativePos.y + relativePos.z * relativePos.z);
  float timeDelta = time / 1.0;
  
  transformed.x += distance / 10.0 * sin(sin(timeDelta / 112.90 + 1.35) * distance / 8.66 + 9.71 * sin(timeDelta / 9.13 + 1.82) + 2.91) * (0.5 + sin(timeDelta / 10.73 + 1.09) / 2.0);
  transformed.y += distance / 10.0 * sin(sin(timeDelta / 99.29 + 0.23) * distance / 11.50 + 8.38 * sin(timeDelta / 10.50 + 0.20) + 1.37) * (0.5 + sin(timeDelta / 10.41 + 0.65) / 2.0);
  transformed.z += distance / 10.0 * sin(sin(timeDelta / 112.84 + 3.13) * distance / 9.12 + 8.61 * sin(timeDelta / 9.82 + 1.15) + 0.68) * (0.5 + sin(timeDelta / 9.58 + 0.99) / 2.0);
  
  float rx0 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 104.49 + 0.11) * distance / 10.14 + 11.07 * sin(timeDelta / 9.59 + 0.18) + 1.67) * (0.5 + sin(timeDelta / 8.35 + 2.89) / 2.0);
  transformed.y = transformed.y * cos(rx0) + transformed.z * sin(rx0);
  transformed.z = transformed.z * cos(rx0) - transformed.y * sin(rx0);
  float ry0 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 114.13 + 0.17) * distance / 10.05 + 11.51 * sin(timeDelta / 9.16 + 0.08) + 1.76) * (0.5 + sin(timeDelta / 10.94 + 0.05) / 2.0);
  transformed.z = transformed.z * cos(ry0) + transformed.x * sin(ry0);
  transformed.x = transformed.x * cos(ry0) - transformed.z * sin(ry0);
  float rz0 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 107.04 + 3.12) * distance / 10.42 + 11.59 * sin(timeDelta / 10.82 + 1.94) + 2.44) * (0.5 + sin(timeDelta / 9.31 + 1.12) / 2.0);
  transformed.x = transformed.x * cos(rz0) + transformed.y * sin(rz0);
  transformed.y = transformed.y * cos(rz0) + transformed.x * sin(rz0);
  float ry1 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 84.34 + 2.20) * distance / 11.70 + 10.95 * sin(timeDelta / 9.56 + 2.24) + 1.85) * (0.5 + sin(timeDelta / 8.78 + 0.87) / 2.0);
  transformed.z = transformed.z * cos(ry1) + transformed.x * sin(ry1);
  transformed.x = transformed.x * cos(ry1) - transformed.z * sin(ry1);
  float rz1 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 100.18 + 2.52) * distance / 10.03 + 9.83 * sin(timeDelta / 10.71 + 2.29) + 0.61) * (0.5 + sin(timeDelta / 10.67 + 1.73) / 2.0);
  transformed.x = transformed.x * cos(rz1) + transformed.y * sin(rz1);
  transformed.y = transformed.y * cos(rz1) + transformed.x * sin(rz1);
  float rx1 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 112.57 + 2.90) * distance / 9.65 + 10.59 * sin(timeDelta / 9.71 + 2.65) + 2.47) * (0.5 + sin(timeDelta / 10.17 + 2.11) / 2.0);
  transformed.y = transformed.y * cos(rx1) + transformed.z * sin(rx1);
  transformed.z = transformed.z * cos(rx1) - transformed.y * sin(rx1);
  float rz2 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 112.05 + 0.91) * distance / 11.61 + 11.03 * sin(timeDelta / 9.13 + 1.27) + 1.60) * (0.5 + sin(timeDelta / 11.34 + 1.57) / 2.0);
  transformed.x = transformed.x * cos(rz2) + transformed.y * sin(rz2);
  transformed.y = transformed.y * cos(rz2) + transformed.x * sin(rz2);
  float rx2 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 108.48 + 0.97) * distance / 9.14 + 11.68 * sin(timeDelta / 9.79 + 1.80) + 1.09) * (0.5 + sin(timeDelta / 11.12 + 1.26) / 2.0);
  transformed.y = transformed.y * cos(rx2) + transformed.z * sin(rx2);
  transformed.z = transformed.z * cos(rx2) - transformed.y * sin(rx2);
  float ry2 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 91.29 + 0.14) * distance / 10.93 + 10.84 * sin(timeDelta / 11.93 + 0.23) + 0.38) * (0.5 + sin(timeDelta / 10.52 + 3.08) / 2.0);
  transformed.z = transformed.z * cos(ry2) + transformed.x * sin(ry2);
  transformed.x = transformed.x * cos(ry2) - transformed.z * sin(ry2);
  float rz3 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 82.40 + 2.07) * distance / 9.96 + 8.75 * sin(timeDelta / 9.66 + 1.81) + 1.72) * (0.5 + sin(timeDelta / 11.83 + 1.76) / 2.0);
  transformed.x = transformed.x * cos(rz3) + transformed.y * sin(rz3);
  transformed.y = transformed.y * cos(rz3) + transformed.x * sin(rz3);
  float ry3 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 87.49 + 2.59) * distance / 10.89 + 8.14 * sin(timeDelta / 9.84 + 0.27) + 3.11) * (0.5 + sin(timeDelta / 8.11 + 1.60) / 2.0);
  transformed.z = transformed.z * cos(ry3) + transformed.x * sin(ry3);
  transformed.x = transformed.x * cos(ry3) - transformed.z * sin(ry3);
  float rx3 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 112.25 + 2.20) * distance / 9.38 + 8.20 * sin(timeDelta / 8.33 + 2.45) + 1.87) * (0.5 + sin(timeDelta / 8.55 + 2.64) / 2.0);
  transformed.y = transformed.y * cos(rx3) + transformed.z * sin(rx3);
  transformed.z = transformed.z * cos(rx3) - transformed.y * sin(rx3);
  float ry4 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 119.42 + 1.96) * distance / 9.83 + 11.13 * sin(timeDelta / 10.80 + 1.83) + 1.19) * (0.5 + sin(timeDelta / 8.83 + 1.37) / 2.0);
  transformed.z = transformed.z * cos(ry4) + transformed.x * sin(ry4);
  transformed.x = transformed.x * cos(ry4) - transformed.z * sin(ry4);
  float rx4 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 113.24 + 1.30) * distance / 9.82 + 11.86 * sin(timeDelta / 10.41 + 1.49) + 1.09) * (0.5 + sin(timeDelta / 8.27 + 3.05) / 2.0);
  transformed.y = transformed.y * cos(rx4) + transformed.z * sin(rx4);
  transformed.z = transformed.z * cos(rx4) - transformed.y * sin(rx4);
  float rz4 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 111.75 + 2.65) * distance / 10.60 + 10.56 * sin(timeDelta / 8.80 + 0.54) + 0.71) * (0.5 + sin(timeDelta / 8.65 + 0.77) / 2.0);
  transformed.x = transformed.x * cos(rz4) + transformed.y * sin(rz4);
  transformed.y = transformed.y * cos(rz4) + transformed.x * sin(rz4);
  float rx5 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 80.48 + 0.74) * distance / 10.08 + 10.78 * sin(timeDelta / 11.73 + 1.59) + 1.92) * (0.5 + sin(timeDelta / 11.36 + 1.45) / 2.0);
  transformed.y = transformed.y * cos(rx5) + transformed.z * sin(rx5);
  transformed.z = transformed.z * cos(rx5) - transformed.y * sin(rx5);
  float rz5 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 102.02 + 1.65) * distance / 10.52 + 11.40 * sin(timeDelta / 10.88 + 1.35) + 0.54) * (0.5 + sin(timeDelta / 11.82 + 2.17) / 2.0);
  transformed.x = transformed.x * cos(rz5) + transformed.y * sin(rz5);
  transformed.y = transformed.y * cos(rz5) + transformed.x * sin(rz5);
  float ry5 = sqrt(distance) / 100.0 * sin(sin(timeDelta / 104.36 + 2.46) * distance / 11.02 + 10.13 * sin(timeDelta / 10.02 + 0.30) + 1.45) * (0.5 + sin(timeDelta / 9.69 + 1.32) / 2.0);
  transformed.z = transformed.z * cos(ry5) + transformed.x * sin(ry5);
  transformed.x = transformed.x * cos(ry5) - transformed.z * sin(ry5);
  
  #include <morphtarget_vertex>
  #include <skinning_vertex>
  #include <displacementmap_vertex>
  #include <project_vertex>
  #include <logdepthbuf_vertex>
  #include <clipping_planes_vertex>
  vViewPosition = - mvPosition.xyz;
  #include <worldpos_vertex>
  #include <shadowmap_vertex>
  #include <fog_vertex>
  #ifdef USE_TRANSMISSION
    vWorldPosition = worldPosition.xyz;
  #endif
}
`;

const fragmentShader = (length) => {
  let expression = glsl`texture2D(colorMaps[0], colorMapsUvs[0])`;
  for (let i = 1; i < length; i++) {
    expression = glsl`mix(
  ${expression},
  texture2D(colorMaps[${i}], colorMapsUvs[${i}]),
  texture2D(alphaMaps[${i - 1}], vUv).r
)`;

      console.log(expression);

  }

  return glsl`
#define STANDARD
#ifdef PHYSICAL
  #define IOR
  #define SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
  uniform float ior;
#endif
#ifdef SPECULAR
  uniform float specularIntensity;
  uniform vec3 specularColor;
  #ifdef USE_SPECULARINTENSITYMAP
    uniform sampler2D specularIntensityMap;
  #endif
  #ifdef USE_SPECULARCOLORMAP
    uniform sampler2D specularColorMap;
  #endif
#endif
#ifdef USE_CLEARCOAT
  uniform float clearcoat;
  uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
  uniform float iridescence;
  uniform float iridescenceIOR;
  uniform float iridescenceThicknessMinimum;
  uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
  uniform vec3 sheenColor;
  uniform float sheenRoughness;
  #ifdef USE_SHEENCOLORMAP
    uniform sampler2D sheenColorMap;
  #endif
  #ifdef USE_SHEENROUGHNESSMAP
    uniform sampler2D sheenRoughnessMap;
  #endif
#endif
varying vec3 vViewPosition;
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
#include <bsdfs>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

// Custom:
#ifdef USE_ALPHA_MAPS
uniform sampler2D colorMaps[NUMBER_OF_COLOR_MAPS];
uniform sampler2D alphaMaps[NUMBER_OF_ALPHA_MAPS];
// From vertex shader:
varying vec2 colorMapsUvs[NUMBER_OF_COLOR_MAPS];
#endif

void main() {
  #include <clipping_planes_fragment>
  vec4 diffuseColor = vec4( diffuse, opacity );
  ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
  vec3 totalEmissiveRadiance = emissive;
  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>

  // Custom:
  #ifdef USE_ALPHA_MAPS
  vec4 alphaMapColor = ${expression};
  diffuseColor *= alphaMapColor;
  #endif

  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <roughnessmap_fragment>
  #include <metalnessmap_fragment>
  #include <normal_fragment_begin>
  #include <normal_fragment_maps>
  #include <clearcoat_normal_fragment_begin>
  #include <clearcoat_normal_fragment_maps>
  #include <emissivemap_fragment>
  // accumulation
  #include <lights_physical_fragment>
  #include <lights_fragment_begin>
  #include <lights_fragment_maps>
  #include <lights_fragment_end>
  // modulation
  #include <aomap_fragment>
  vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
  vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
  #include <transmission_fragment>
  vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
  #ifdef USE_SHEEN
    // Sheen energy compensation approximation calculation can be found at the end of
    // https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
    float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
    outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecular;
  #endif
  #ifdef USE_CLEARCOAT
    float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );
    vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
    outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + clearcoatSpecular * material.clearcoat;
  #endif
  #include <output_fragment>
  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>
}
`;
};
