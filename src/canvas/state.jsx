//definition d elobject de base
import { proxy } from "valtio";

const state=proxy({
    intro:true ,// on est dans la home page
    color:'#FFF',
    // isLogoTexture:true,
    // isFullTexture:false,
    // logoDecal:'./threejs.png',
    // fullDecal:'./thareejs.png'
    selectedPattern: 'floral',
    modelPosition: { x: 1, y: -0.2, z: 0 }, // par défaut à droite

});
export default state;