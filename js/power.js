AFRAME.registerComponent("elemental",{
    schema: {
        kind: {type: 'string', default: 'fire'}
    },
    init: function(){
        let t=document.querySelector("#txt");
        let p =document.querySelector("#player");
        const { kind }=this.el.getAttribute("elemental");
        this.el.addEventListener("mouseenter", () => {
            t.setAttribute("text",{value:kind.toUpperCase()});
            p.setAttribute("player",{pickableItem: kind});
        });
        this.el.addEventListener("mouseleave", ()=>{
            t.setAttribute("text",{value:' '});
            p.setAttribute("player",{pickableItem: ' '});
        } )
    }
});

AFRAME.registerComponent("play",{
    init:function(){
        this.mm();
    },
    mm:function(){
        this.el.addEventListener("click",()=>{
            let b=document.querySelector("#black");
            b.setAttribute("visible", true);
            
            const scene = document.querySelector("#scene");
            let s = document.createElement("a-entity");
            s.setAttribute("spawn",{});
            scene.appendChild(s);

            let p = document.querySelector("#player");
            p.setAttribute("wasd-controls",{acceleration: 200});
            p.setAttribute("player",{});
            p.setAttribute("player-movement",{});

            for(let i=1;i<6;i++){
                document.querySelector(`#icon_${i}`).setAttribute("visible", true)
            }
            for(let i=1;i<=4;i++){
                scene.removeChild(document.querySelector(`#p${i}`));
            }
            scene.removeChild(document.querySelector("#quit"))
            scene.removeChild(this.el);
            this.el.removeAttribute("play");
        });
    }
});

AFRAME.registerComponent("quit",{
    init: function(){
        this.mm()
    },
    mm:function(){
        this.el.addEventListener("click",()=>{
            window.close();
        })
    }
})