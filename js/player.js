let rules={
            "stone": ["fire","electricity"],
            "fire":["electricity", "wind"],
            "water":["stone","fire"],
            "wind":["stone","water"],
            "electricity":["water","wind"]
};

let player_score=0;
let enemy_score=0;

AFRAME.registerComponent("player",{
    schema: {
        pickableItem: {type: 'string', default: ' '},
        inventory: {type:'array', default: []},
    },
    init: function(){
        let add=true
        let canAdd=true;
        window.addEventListener("mousedown", (e)=>{
            let doOnce=true;
            if(e.button==0 && add && canAdd){
                let { pickableItem, inventory }=this.el.getAttribute("player");
                if(pickableItem!=' '){
                    add=false;
                    inventory.push(pickableItem);
                    this.onCollect(pickableItem);
                    this.el.setAttribute("player", {inventory: inventory});
                    if(inventory.length==5){
                        canAdd=false;
                        if(doOnce){
                            this.change();
                            this.show();
                            doOnce=false;
                        }
                    }
                }
            }
        });
        
        window.addEventListener("mouseup", (e)=>{
            if(e.button==0){
                add=true;
            }
        });


    },
    onCollect: function(x){
        for(var i=1;i<=5;i++){
            let spot=document.querySelector(`#icon_${i}`);
            if(spot.getAttribute("src")=='#empty'){
                spot.setAttribute("src", `#${x}`)
                break;
            }
        }
    },
    
    change: function(){
        const scene=document.querySelector("#scene");
        let t=document.querySelector("#fight")

        for(let i=0; i<10; i++){
            let e=document.querySelector(`#elem_${i}`);
            scene.removeChild(e);
        }

        let b= document.querySelector("#black");
        b.setAttribute("visible",true);
        b.setAttribute("animation", {property: 'opacity',from:0,to:1,easing:'linear',loop:false,dur:1000});

        t.setAttribute("visible", true);
    },

    show: function(){
        let d=false;
        window.addEventListener("keydown", (e)=>{
            if(e.key=="z"){
                if(!d){
                    let t=document.querySelector("#fight")
                    t.setAttribute("visible", false);
                    this.createEnemy();
                    this.el.setAttribute("wasd-controls",{acceleration: 0});
                    this.el.setAttribute("position",{x: 0,y: 1,z: 23});
                    let b= document.querySelector("#black");
                    b.setAttribute("animation", {property: 'opacity',from:1,to:0,easing:'linear',loop:false,dur:1000});
                    b.setAttribute("visible",false);
                    d=true;
                    let { inventory } = this.el.getAttribute("player");
                    this.el.setAttribute("player-fight",{inventory: inventory});
                    document.querySelector("#player_score").setAttribute("visible",true);
                    document.querySelector("#enemy_score").setAttribute("visible",true);
                    this.el.removeAttribute("player-movement");
                    this.el.removeAttribute("player");
                }
            }
        });
    },
    createEnemy: function(){
        const scene=document.querySelector("#scene");
        let elm=document.createElement("a-entity");
        elm.setAttribute("gltf-model", "#monster_model");
        elm.setAttribute("id","monster");
        elm.setAttribute("scale",{x:0.3,y:0.3,z:0.3});
        elm.setAttribute("enemy",{});
        let y = 4;
        let x=0;
        let z=15;
        elm.setAttribute("position",{x:x,y:y,z:z});
        let t=y+0.75;
        let f=y-0.25;
        elm.setAttribute("animation", {property: 'position', from: `${x} ${t} ${z}`, to: `${x} ${f} ${z}`,dir:'alternate',easing: 'easeInOutSine', loop: true, dur: 1000});
        elm.setAttribute("animation__2", {property: 'rotation', from: "10 0 -5", to: "15 0 5",dir:'alternate',easing: 'easeInOutSine', loop: true, dur: 8000});
        scene.appendChild(elm);
    },
});


AFRAME.registerComponent("player-fight",{
    schema: {inventory:{type:"array",default:[]},chances: {type:"int", default:0}},
    init: function(){
        document.querySelector("#cursor").setAttribute("visible",false)
        window.addEventListener("keydown",(e)=>{
            let no=e.key;
            if(no=="1" || no=="2" || no=="3" || no=="4" || no=="5"){
                this.fight(no);
            }
        });
    },
    fight: function(p){
        let { inventory } = this.el.getAttribute("player-fight");
        let { weapon } = document.querySelector("#monster").getAttribute("enemy");

        p_s = document.querySelector("#player_score")
        e_s = document.querySelector("#enemy_score")
        let i=p-1;
        if(inventory[i]){
            let power=inventory[i];
            document.querySelector(`#icon_${p}`).setAttribute("src","#empty");
            inventory[i]=null;
            this.el.setAttribute("player-fight",{inventory: inventory});
            
            let rand = Math.round(Math.random()*(weapon.length-1));
            let power_e = weapon[rand];
            let winner;

            if(power_e==power){
                player_score++;
                p_s.setAttribute("text",{value: `Player: ${player_score}`});
                enemy_score++;
                e_s.setAttribute("text",{value: `Enemy: ${enemy_score}`});
                winner="tie";
                
            }else{
                let r=rules[power];
                if(r[0]==power_e || r[1]==power_e){
                    player_score++;
                    p_s.setAttribute("text",{value: `Player: ${player_score}`});
                    winner="player";
                }else{
                    enemy_score++;
                    e_s.setAttribute("text",{value: `Enemy: ${enemy_score}`});
                    winner="enemy"
                }
            }

            this.createElm(power, power_e, winner);


            let { chances } = this.el.getAttribute("player-fight");
            
            chances++;
            this.el.setAttribute("player-fight",{chances: chances});
            let win=" ";
            if(chances>=5){
                if(player_score==enemy_score){
                    win="Game Tied";
                }else{
                    win=player_score>enemy_score?"You Win":"You Lost";
                }
                document.querySelector("#black").setAttribute("visible",true);
                document.querySelector("#black").setAttribute("animation", {property: 'opacity', from: 0, to: 1, easing: 'linear', loop:false,dur:2500})
                document.querySelector("#GO").setAttribute("Visible",true);
                document.querySelector("#winner").setAttribute("text", {value: `!! ${win} !!`});
                document.querySelector("#winner").setAttribute("visible", true);
                this.el.setAttribute("look-controls",{pointerLockEnabled: false});
                this.el.removeAttribute("player-fight");
                this.el.removeAttribute("player-movement");

            };
        };
    },
    createElm: function(elm, elm_e, winner){
        const scene=document.querySelector("#scene");

        let pos=this.el.getAttribute("position");
        let pos_e=document.querySelector("#monster").getAttribute("position");
        let z=19;
        let y = 3;


        let p_el=document.createElement("a-image");
        p_el.setAttribute("position",pos);
        p_el.setAttribute("id", "p_el");
        p_el.setAttribute("src", `#${elm}`);
        p_el.setAttribute("width",0.5);
        p_el.setAttribute("height",0.5);
        p_el.setAttribute("animation",{property:'position',from:`${pos.x} ${pos.y} ${pos.z}`, to:`${pos_e.x} ${y} ${z}`,easing:'easeInOutSine',loop:false,dur:1000});
        p_el.setAttribute("scale", {x:1,y:1,z:1});
        scene.appendChild(p_el);

        let e_el=document.createElement("a-image");
        e_el.setAttribute("position",pos);
        e_el.setAttribute("id", "e_el");
        e_el.setAttribute("src", `#${elm_e}`);
        e_el.setAttribute("width",0.5);
        e_el.setAttribute("height",0.5);
        e_el.setAttribute("animation",{property:'position',from:`${pos_e.x} ${pos_e.y} ${pos_e.z}`, to:`${pos.x} ${y} ${z}`,easing:'easeInOutSine',loop:false,dur:1000});
        e_el.setAttribute("scale", {x:1,y:1,z:1});
        scene.appendChild(e_el);

        let t=1500;
                            
        let scale=5;
        if(winner=="player"){
            p_el.setAttribute("animation__2",{property:'scale',from:`1 1 1`, to:`3 3 3`,easing:'linear',loop:false,dur:2000});
            t=2200;
            document.querySelector("#winS").play();
        }else{
            if(winner=="enemy"){
                e_el.setAttribute("scale",{x:scale,y:scale,z:scale});
                p_el.setAttribute("scale",{x:1,y:1,z:1});
                t=1500;
                document.querySelector("#looseS").play();
            }else{
                if(winner=="tie"){
                    t=1000;
                    document.querySelector("#tieS").play();
                }
            }
        }

        setInterval(() => {
            if(p_el && e_el){
                scene.removeChild(p_el);
                scene.removeChild(e_el);
                p_el='';
                e_el='';
            }
        }, t);

    }
});

AFRAME.registerComponent("player-movement", {
    init: function () {
      this.walk();
    },
    walk: function () {
      window.addEventListener("keydown", (e) => {
        let x=document.querySelector("#monster");
        if(! x){
            if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
              var entity = document.querySelector("#sound2");
              entity.components.sound.playSound();
            }
        }
      });
    },
  });