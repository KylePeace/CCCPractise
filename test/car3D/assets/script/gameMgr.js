
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, 0);
    },
});
