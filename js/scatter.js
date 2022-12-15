AFRAME.registerComponent("spawn",{
    init: function(){
        let elemts=["fire", "water", "electricity", "wind", "stone"];
        let scene=document.querySelector("#scene");
        for(var i=0; i<10; i++){
            let x=Math.random()*20;
            let z=Math.random()*20;
            let elem=document.createElement("a-entity");
            let y=0.5;
            elem.setAttribute("position", {x: x, y: y, z: z});
            let e='';
            if(elemts[i]){
                e=elemts[i];
                
                elem.setAttribute("gltf-model", `./assets/Models/${elemts[i]}/scene.gltf`);
            }else{
                
                let power = Math.round(Math.random()*4);
                e=elemts[power];
                elem.setAttribute("gltf-model", `./assets/Models/${e}/scene.gltf`);
            }
            elem.setAttribute("Animation-mixer", {});
            elem.setAttribute("id", `elem_${i}`)
            let dd=[600,800,500,700,750,850,900,950];
            let d=dd[Math.round(Math.random()*7)];
                       
            if(e=='fire'){
                let s= 1;
                elem.setAttribute("scale",{x:s, y:s, z:s,});
            }else{
                if(e=='water'){
                    let s= 1;
                    elem.setAttribute("scale",{x:s, y:s, z:s});
                }else{
                    if(e=='electricity'){
                        let s= 0.05;
                        elem.setAttribute("scale",{x:s, y:s, z:s});
                        y=0.7;
                        elem.setAttribute("position", {x: x, y: y, z: z});
                    }else{
                        if(e=='wind'){
                            let s= 0.002;
                            elem.setAttribute("scale",{x:s, y:s, z:s});
                            y=0.5;
                            elem.setAttribute("position", {x: x, y: y, z: z});
                        }else{
                            if(e=='stone'){
                                let s= 0.3;
                                elem.setAttribute("scale",{x:s, y:s, z:s});
                            }
                        }
                    }
                }
            }
            let t=y+0.05;
            let f=y-0.05;
            elem.setAttribute("elemental", {kind: e});
            elem.setAttribute("animation", {property: 'position', from: `${x} ${t} ${z}`, to: `${x} ${f} ${z}`,dir:'alternate',easing: 'linear', loop: true, dur: d})
            scene.appendChild(elem);
        }
    }
})