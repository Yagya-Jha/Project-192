AFRAME.registerComponent("enemy",{
    schema:{
        weapon: {type: "array", default: []}
    },
    init:function(){
        let elements=["fire", "water", "electricity", "wind", "stone","fire"];
        let weapon=[];
        for(var i=0;i<5;i++){
            let rand = Math.round(Math.random()*(elements.length-1));
            weapon.push(elements[rand]);
        }
        console.log(weapon);
        this.el.setAttribute("enemy",{weapon: weapon});
    },
});