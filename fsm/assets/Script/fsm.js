let manager = null
let fsm = new StateMachine({
	data: {"manager":null},
	transitions: [
		{name: 'init',from: "none",to: 'idle'},
		{name: 'toIdle',from: ['attack', 'run',"idle"],to: 'idle'},
		{name: 'toAttack',from: ['idle','run'],to: 'attack'},
		{name: 'toRun',from: ['attack', 'idle'],to: 'run'},
	],
	methods: {
		onInit:function(){
			console.log("fsm init")
			fsm.manager.idle()
		},
		onToIdle: function () {
			fsm.manager.idle()
		},

		
		onBeforeToAttack(){
			fsm.manager.setTipLabel("我要开始攻击了！")
		},

		onToAttack: function (lifecycle) {
			fsm.manager.attack(lifecycle.from)
		},

		onLeaveAttack(){
			fsm.manager.setTipLabel("攻击结束了！")
		},
		onToRun: function () {
			fsm.manager.run()
		},

		onEnterState(){
			fsm.manager.setDebugLabel("player当前状态："+fsm.state)
		}
	}
})


let turnFsm  = new StateMachine({
	data: {"manager":null},
	// init:"player",
	transitions: [
		{name: 'init',from: "none",to: 'player'},
		{name: 'toPlayer',from: "enemy",to: 'player'},
		{name: 'toEnemy',from: "player",to: 'enemy'},
	],
	methods:{
		onInit(){
			console.log("turnFsm init")
			fsm.init()
		},
	
		onToPlayer(){
			
			//fsm.init()
		},
	
		onToEnemy(){
			turnFsm.manager.enemyAttack()
		}
	}
})


cc.Class({
	extends: cc.Component,

	properties: {
		player: cc.Animation,
		enemy: cc.Animation,
		tip:cc.Label,
		debug:cc.Label
	},

	onLoad: function () {
		manager = this
		fsm.manager = this
		turnFsm.manager = this

		this.enemyStand()
	},

	start(){
		//初始化
		turnFsm.init()
	},

	setTipLabel(str){
		this.tip.string = str
		this.tip.node.active = true

		cc.tween(this.tip.node)
			.to(0.1, { opacity: 255 })
			.to(1.2, { opacity: 0 })
			.start()
	},

	setDebugLabel(str){
		this.debug.string = str
	},

	idle(){
		let animState =  this.player.play("Idle")
		animState.wrapMode = cc.WrapMode.Loop 
	},

	attack(fromState){
		
		let animState = this.player.play("Attack1")
		animState.wrapMode = cc.WrapMode.Normal 
		animState.off("finished")
		animState.on('finished', ()=>{
			animState.off("finished")
			if(fromState == 'run'){
				fsm.toRun()
			}else{
				fsm.toIdle()
			}
			turnFsm.toEnemy()
		});
	},

	run(){
		let animState = this.player.play("Run")
		animState.wrapMode = cc.WrapMode.Loop 
	},

	btnRunCb(){
		if(fsm.is("run")||turnFsm.is("enemy")){
			return 
		}
		fsm.toRun()		
	},

	btnAttckCb(){
		console.log("fsm:",fsm.state)
		console.log("turnFsm:",turnFsm.state)

		if(fsm.is("attack")||turnFsm.is("enemy")){
			return 
		}
		fsm.toAttack()
	},

	enemyAttack(){
		let animState =  this.enemy.play("cleek1")
		animState.wrapMode = cc.WrapMode.Normal
		animState.speed = 0.5
		animState.off("finished")
		animState.on('finished', ()=>{
			animState.off("finished")
			this.enemyStand()
			turnFsm.toPlayer()
		});
	},

	enemyStand(){
		let animState =  this.enemy.play("dizzy")
		animState.wrapMode = cc.WrapMode.Loop
		animState.speed = 2

	}
});