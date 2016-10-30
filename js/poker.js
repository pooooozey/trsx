/*
 * 
 * spade 黑桃
 * heart 红桃
 * club 梅花
 * diamond 方块
 * 
 * 
 * */
var allPoker = [
	[1,"A","spade",14,1],
	[2,"2","spade",2,2],
	[3,"3","spade",3,3],
	[4,"4","spade",4,4],
	[5,"5","spade",5,5],
	[6,"6","spade",6,6],
	[7,"7","spade",7,7],
	[8,"8","spade",8,8],
	[9,"9","spade",9,9],
	[10,"10","spade",10,10],
	[11,"J","spade",11,0.5],
	[12,"Q","spade",12,0.5],
	[13,"K","spade",13,0.5],
	[14,"A","heart",14,1],
	[15,"2","heart",2,2],
	[16,"3","heart",3,3],
	[17,"4","heart",4,4],
	[18,"5","heart",5,5],
	[19,"6","heart",6,6],
	[20,"7","heart",7,7],
	[21,"8","heart",8,8],
	[22,"9","heart",9,9],
	[23,"10","heart",10,10],
	[24,"J","heart",11,0.5],
	[25,"Q","heart",12,0.5],
	[26,"K","heart",13,0.5],
	[27,"A","club",14,1],
	[28,"2","club",2,2],
	[29,"3","club",3,3],
	[30,"4","club",4,4],
	[31,"5","club",5,5],
	[32,"6","club",6,6],
	[33,"7","club",7,7],
	[34,"8","club",8,8],
	[35,"9","club",9,9],
	[36,"10","club",10,10],
	[37,"J","club",11,0.5],
	[38,"Q","club",12,0.5],
	[39,"K","club",13,0.5],
	[40,"A","diamond",14,1],
	[41,"2","diamond",2,2],
	[42,"3","diamond",3,3],
	[43,"4","diamond",4,4],
	[44,"5","diamond",5,5],
	[45,"6","diamond",6,6],
	[46,"7","diamond",7,7],
	[47,"8","diamond",8,8],
	[48,"9","diamond",9,9],
	[49,"10","diamond",10,10],
	[50,"J","diamond",11,0.5],
	[51,"Q","diamond",12,0.5],
	[52,"K","diamond",13,0.5]
];
var tmpPoker = [];//每局重新洗的牌
var allPlayer = [];//所有玩家(和电脑)

function Poker(){
	this.id;//扑克牌唯一标示
	this.cards;//牌面
	this.color;//花色
	this.num;//数值（1-14，用于第一次比牌）
	this.num2;//数值2（0.5-10，用于第二次比牌）
	
	
}

Poker.prototype.init = function(arr){
	this.id = arr[0];
	this.cards = arr[1];
	this.color = arr[2];
	this.num = arr[3];
	this.num2 = arr[4];
	this.playerId = null;
};

Poker.prototype.setPlayerId = function(playerId){
	this.playerId = playerId;
}


function Player(){
	this.id;
	this.name;
	this.money;//总金额
	this.pokerArr = [];//手牌
	this.pokerCompare1 = null;//设置第一次比较的牌
	this.pokerCompare2 = [];//设置第二次比较的牌
	this.pokerCompare3 = [];//设置第三次比较的牌
	this.winNum = 0;
}

Player.prototype.init = function(id,name,money){
	this.id = id;
	this.name = name;
	this.money = money;
	
};

Player.prototype.getPokerArr = function(arr){
	for(var i=0;i<arr.length;i++){
		this.pokerArr[i] = arr[i];
	}
};

Player.prototype.setPokerCompare1 = function(id){
	this.pokerCompare1 = id;
};

function play(){
	$(".body li").each(function(){
		$(this).find("img").attr("cid","");
	});
	
	playerGetPoker();//获取纸牌
//	tmpSet([0,25,4,30,27,15],allPlayer[0]);
//	tmpSet([36,50,26,46,10,31],allPlayer[1]);
//	tmpSet([14,45,33,3,13,29],allPlayer[2]);
	
	//设置对手牌
	for(var i=1;i<allPlayer.length;i++){
		autoSetCompare(allPlayer[i]);
	}
	
	//设置自己牌
	setting.selfPlayer = allPlayer[0];
	setMyPoker();
	
	$("#myPoker").show().find("li").stop(false,false).css({top:50}).hide().each(function(i,o){
		$(this).delay(i*100).animate({top:0,opacity:"show"});
	});
	
	

	
//	function tmpSet(indArr,obj){
//		var tmpArr = [];
//		for(var i=0;i<6;i++){
//			var p = new Poker();
//			p.init(allPoker[indArr[i]]);
//			p.setPlayerId(obj.id);
//			tmpArr.push(p)
//		}
//		obj.getPokerArr(tmpArr);
//	}
	
}

function createPlayer(size,money){
	for(var i=0;i<size;i++){
		allPlayer[i] = new Player();
		allPlayer[i].init(i,"",money);
	}
	$(".body .money").html(money);
}

function playerGetPoker(){
	//每个玩家获得牌组
	var temporaryArr = allPoker.concat();
	for(var i=0;i<allPlayer.length;i++){
		var arr = [];
		for(var j=0;j<6;j++){
			arr[j] = getOnePoker(temporaryArr,allPlayer[i].id);
		}
		allPlayer[i].getPokerArr(arr);
	}
	
}

function getOnePoker(arr,playerId){
	//获取一张牌
	var ind = parseInt(Math.random()*(arr.length-1));
	var thisArr = arr.splice(ind,1)[0];
	var poker = new Poker();
	poker.init(thisArr);
	poker.setPlayerId(playerId);
	return poker;
}

function contrastNum(arr){
	//第一次对比
	var max = arr[0];
	for(var i = 1;i<arr.length;i++){
		if(max<arr[i]){
			max = arr[i];
		}
	}
	return max;
}

function autoSetCompare(player){
	//设置自动分配手牌
	
//	var hasP = hasPlane(player.pokerArr);
//	var hasB = hasBoat(player.pokerArr);
//	if(hasB){
//		player.pokerCompare3 = hasB;/////////////
//	}
	tmpSetCompare(player);
	
}

function tmpSetCompare(player){
	//临时用的自动分配手牌
	player.pokerCompare1 = player.pokerArr[0];
	player.pokerCompare2 = [player.pokerArr[1],player.pokerArr[2]];
	player.pokerCompare3 = [player.pokerArr[3],player.pokerArr[4],player.pokerArr[5]];
	
}

function isPlane(pokerArr){
	//判断有没有飞机
	console.log(pokerArr)
	for(var i=0;i<pokerArr.length;i++){
		var tmp = pokerArr[i].cards;
		var tmpIndArr = [pokerArr[i]];
		var num = 1;
		for(var j=0;j<pokerArr.length;j++){
			if(i!==j){
				if(tmp==pokerArr[j].cards){
					num++;
					tmpIndArr.push(pokerArr[j]);
					if(num>=3){
						
						return tmpIndArr;
					}
				}
			}
		}
	}
	return false;
}

function isBoat(pokerArr){
	//判断有没有同色
	for(var i=0;i<pokerArr.length;i++){
		var tmp = pokerArr[i].color;
		var tmpIndArr = [pokerArr[i]];
		var num = 1;
		for(var j=0;j<pokerArr.length;j++){
			if(i!==j){
				if(tmp==pokerArr[j].color){
					num++;
					tmpIndArr.push(pokerArr[j]);
					if(num>=3){
						
						return tmpIndArr;
					}
				}
			}
		}
	}
	return false;
}

function isConnect(pokerArr){
	//判断有没有顺子
	var tmpNumArr = [];
	for(var i=0;i<pokerArr.length;i++){
		tmpNumArr.push(pokerArr[i].num);
	}
	var arr2 = tmpNumArr.sort(function(a,b){return a>b?1:-1});
	if((arr2[0]+1)==arr2[1]&&arr2[1]==(arr2[2]-1)){
		return true;
	}else if((arr2[0]+1)==arr2[1]&&arr2[2]==14&&arr2[0]==2){
		//A,2,3
		console.log((arr2))
		return true;
	}
	
	return false;
}

function isCouple(pokerArr){
	//对子
	
	for(var i=0;i<3;i++){
		var tmpPokerNum = pokerArr[i].num;
		for(var j=0;j<3;j++){
			var tmpPokerNum2 = pokerArr[j].num;
			if(i!=j&&tmpPokerNum==tmpPokerNum2){
				return true;
			}
		}
	}
	
	return false;
}






