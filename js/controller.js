var setting = {
	selfPlayer :	null,
	win_width : 0,
	win_height : 0,
	maxSelectSize : 3,
	selectArr : [],
	selectSize : 0,
	readyOnf : [false,false,false],
	tmpCompare1 : null,
	tmpCompare2 : [],
	tmpCompare3 : [],
	nowShowInd : 1,
	price : 100,
	tipInd :0,
	hasPlane : false,
	hasBat : false
};

window.onresize = function(){
	windowResize();
	
};

function windowResize(){
	setting.win_width = $(window).width();
	setting.win_height = $(window).height();
	
}

function main(){
	windowResize();
	createPlayer(3,3000);
//	play();
//	selectPoker();
	
	
	
}

function setMyPoker(){
	//显示手牌
	$("#myPoker li").each(function(){
		$(this).find("img").attr({
			'src':'images/poker'+setting.selfPlayer.pokerArr[$(this).index()].id+'.jpg',
			'cid':setting.selfPlayer.pokerArr[$(this).index()].id
		});
	});
	
	
	
	
	
}

function selectPoker(){
	$("#myPoker li").click(function(){
		if($(this).hasClass("old")){
			return;
		}
		setting.selectSize = $("#myPoker .select").size();
		if($(this).hasClass("select")){
			$(this).removeClass("select");
		}else{
			if($("#myPoker .select").size()>=setting.maxSelectSize){
				return;
			}
			$(this).addClass("select");
		}
		setting.selectSize = $("#myPoker .select").size();
		if(setting.selectSize<=0){
			$("#okPoker .btns a").removeClass("ready");
		}else{
			$("#okPoker .btns .sure,#okPoker .btns .cancel").addClass("ready");
		}
		
	});
	
	$("#okPoker .btns .sure").click(function(){
		
		if($(this).hasClass("ready")){
			if(setting.selectSize===1){
				if(setting.readyOnf[0]){
					return;
				}
				setting.tmpCompare1 = $("#myPoker .select img").attr("cid");
				getPiecePoker(setting.tmpCompare1);
				setOkPoker1();
				
			}else if(setting.selectSize===2){
				if(setting.readyOnf[1]){
					return;
				}
				var pC2Arr = [];
				$("#myPoker .select img").each(function(){
					pC2Arr.push(parseInt($(this).attr("cid")));
				});
				setting.tmpCompare2 = pC2Arr;
				setOkPoker2();
				
			}else if(setting.selectSize===3){
				if(setting.readyOnf[2]){
					return;
				}
				var pC3Arr = [];
				$("#myPoker .select img").each(function(){
					pC3Arr.push(parseInt($(this).attr("cid")));
				});
				setting.tmpCompare3 = pC3Arr;
				setOkPoker3();
				
			}
			
			$("#myPoker .select").addClass("old").removeClass("select");
			
			if(isAllReady()){
				$("#okPoker .btns .ok").addClass("ready");
				$(this).removeClass("ready");
			}else{
				$("#okPoker .btns .ok").removeClass("ready");
			}
			
		}
	});
	
	//重置
	$("#okPoker .btns .cancel").click(function(){
		setting.tmpCompare1 = null;
		setting.tmpCompare2 = [];
		setting.tmpCompare3 = [];
		setting.readyOnf = [false,false,false];
		$("#myPoker li").removeClass("select").removeClass("old");
		$("#okPoker li img").each(function(){
			$(this).attr({
				'src':'images/pokerB2.jpg',
				'cid':"-1"
			});
		});
		$("#okPoker .btns a").removeClass("ready");
	});
	
	//点击开始
	$("#okPoker .btns .ok").click(function(){
		if($(this).hasClass("ready")){
			setSelfPoker();
			
			$("#myPoker").hide();
			$("#okPoker .btns .ok,#okPoker .btns .cancel").removeClass("ready");
			$("#okPoker .btns .goOn").addClass("ready");
			
			showCompare1();
		}
	});
	
	//继续对比
	$("#okPoker .btns .goOn").click(function(){
		if($(this).hasClass("ready")){
			if(setting.nowShowInd==1){
				showCompare2();
				setting.nowShowInd++;
			}else if(setting.nowShowInd==2){
				showCompare3();
				setting.nowShowInd++;
				//比完后准备下一局
				//$("#okPoker .btns .goOn").removeClass("ready");
				$(this).html("发牌");
				
			}else{
				//重新开始
				setting.nowShowInd = 1;
				$(this).removeClass("ready");
				$(".body li").removeClass("old").removeClass("losePoker").removeClass("winPoker").removeClass("drawPoker")
				.each(function(){
					$(this).find("img").attr("src","images/pokerB.jpg");
				});

				for(var i=0;i<allPlayer.length;i++){
					allPlayer[i].winNum = 0;
				}
				setting.hasPlane = false;
				setting.hasBat = false;
				setting.tmpCompare1 = null;
				setting.tmpCompare2 = [];
				setting.tmpCompare3 = [];
				setting.readyOnf = [false,false,false];
				$("#myPoker li").removeClass("select").removeClass("old");
				$("#okPoker li img").each(function(){
					$(this).attr({
						'src':'images/pokerB2.jpg',
						'cid':"-1"
					});
				});
				$("#okPoker .btns a").removeClass("ready");
				
				$(this).html("继续");
				
				play();
				
			}
			
		}
		
	});
	
}

function setOkPoker1(){
	$("#okPoker ul").eq(0).find("li img").attr({
		"src":'images/poker'+setting.tmpCompare1+'.jpg',
		"cid":setting.tmpCompare1
	});
	setting.readyOnf[0] = true;
}

function setOkPoker2(){
	var aImg = $("#okPoker ul").eq(1).find("li img");
	for(var i=0;i<2;i++){
		aImg.eq(i).attr({
			"src":'images/poker'+setting.tmpCompare2[i]+'.jpg',
			"cid":setting.tmpCompare2[i]
		});
	}
	setting.readyOnf[1] = true;
}

function setOkPoker3(){
	var aImg = $("#okPoker ul").eq(2).find("li img");
	for(var i=0;i<3;i++){
		aImg.eq(i).attr({
			"src":'images/poker'+setting.tmpCompare3[i]+'.jpg',
			"cid":setting.tmpCompare3[i]
		});
	}
	setting.readyOnf[2] = true;
}

function getPiecePoker(cid){
	//根据id获取对应的牌
	//allPoker[cid-1]
	var onePoker = new Poker();
	onePoker.init(allPoker[cid-1]);
	onePoker.setPlayerId(0);
	return onePoker;
}

function isAllReady(){
	//是否允许开始对比
	for(var i=0;i<3;i++){
		if(!setting.readyOnf[i]){
			return false;
		}
	}
	return true;
}

function setSelfPoker(){
	//设置自己的纸牌
	setting.selfPlayer.pokerCompare1 = getPiecePoker(setting.tmpCompare1);
	
	var tmpArr1 = [];
	for(var i=0;i<2;i++){
		tmpArr1.push(getPiecePoker(setting.tmpCompare2[i]));
	}
	setting.selfPlayer.pokerCompare2 = tmpArr1;
	
	var tmpArr2 = [];
	for(var i=0;i<3;i++){
		tmpArr2.push(getPiecePoker(setting.tmpCompare3[i]));
	}
	setting.selfPlayer.pokerCompare3 = tmpArr2;
	
	
}

function showCompare1(){
	//展示第一轮
	var arr = [];
	
	for(var i=0;i<allPlayer.length;i++){
		arr.push(allPlayer[i].pokerCompare1)
	}
	for(var i=0;i<$(".body .AI").size();i++){
		$(".body .AI").eq(i).find("li img").eq(0).attr({
			'src' : 'images/poker'+(allPlayer[(i+1)].pokerCompare1.id)+'.jpg',
			'cid' : (allPlayer[(i+1)].pokerCompare1.id)
		});
	}
	
	getCompare1Results(arr);
	

}

function getCompare1Results(arr){
	var minArr = [];
	var minNum = 20;
	var maxNum = 0;
	var maxArr = [];
	
	getMinAndMin();
	getMaxAndMin();
	function getMinAndMin(){
		for(var i=0;i<arr.length;i++){
			if(arr[i].num<minNum){
				minNum = arr[i].num;
				minArr = [];
				minArr.push(arr[i]);
			}else if(arr[i].num==minNum){
				minArr.push(arr[i]);
			}
		}
		
	}
	
	function getMaxAndMin(){
		for(var i=0;i<arr.length;i++){
			if(arr[i].num>maxNum){
				maxNum = arr[i].num;
				maxArr = [];
				maxArr.push(arr[i]);
			}else if(arr[i].num==maxNum){
				maxArr.push(arr[i]);
			}
		}
		
	}
	
	if(maxNum!=minNum){
		//最大最小不同，有输赢家

		$(".body li").each(function(){
			for(var i=0;i<minArr.length;i++){
				if($(this).find("img").attr("cid")==minArr[i].id){
					//最小的牌，输
					$(this).addClass("losePoker");
				}
			}
			for(var i=0;i<maxArr.length;i++){
				if($(this).find("img").attr("cid")==maxArr[i].id){
					//最大的牌，胜
					$(this).addClass("winPoker");
				}
			}
		});
		
		//计分
		
		for(var i=0;i<minArr.length;i++){
			allPlayer[minArr[i]["playerId"]]["money"] = allPlayer[minArr[i]["playerId"]]["money"] - setting.price*maxArr.length;
		}
		for(var i=0;i<maxArr.length;i++){
			allPlayer[maxArr[i]["playerId"]]["money"] = allPlayer[maxArr[i]["playerId"]]["money"] + setting.price*minArr.length;
			allPlayer[maxArr[i]["playerId"]]["winNum"]++;
		}
		setNewMoney();
		
		
	}else{
		//所有牌都一样大，平局
		
		$(".body li").each(function(){
			for(var i=0;i<arr.length;i++){
				if($(this).find("img").attr("cid")==arr[i].id){
					//平局
					$(this).addClass("drawPoker");
				}
			}
		});
	}
	
	
}

function showCompare2(){
	//展示第二轮
	var arr = [];
	for(var i=0;i<allPlayer.length;i++){
		arr.push(allPlayer[i].pokerCompare2)
	}
	for(var i=0;i<$(".body .AI").size();i++){
		$(".body .AI").eq(i).find("li img").eq(1).attr({
			'src' : 'images/poker'+(allPlayer[(i+1)].pokerCompare2[0].id)+'.jpg',
			'cid' : (allPlayer[(i+1)].pokerCompare2[0].id)
		});
		$(".body .AI").eq(i).find("li img").eq(2).attr({
			'src' : 'images/poker'+(allPlayer[(i+1)].pokerCompare2[1].id)+'.jpg',
			'cid' : (allPlayer[(i+1)].pokerCompare2[1].id)
		});
	}
	getCompare2Results(arr);
}

function getCompare2Results(arr){
	var minArr = [];
	var minNum = 20;
	var maxNum = 0;
	var maxArr = [];
	
	getMinAndMin();
	getMaxAndMin();
	console.log(maxArr)
	console.log(minArr)
	
	function getMinAndMin(){
		for(var i=0;i<arr.length;i++){
			var n = arr[i][0].num2+arr[i][1].num2;
			if(n>10.5){
				if(minNum<0){
					minArr.push(arr[i]);
				}else{
					minNum = -1;
					minArr = [];
					minArr.push(arr[i]);
				}
				
			}else if(n<minNum){
				minNum = n;
				minArr = [];
				minArr.push(arr[i]);
			}else if(n==minNum){
				minArr.push(arr[i]);
			}
			
		}
	}
	function getMaxAndMin(){
		for(var i=0;i<arr.length;i++){
			var n = arr[i][0].num2+arr[i][1].num2;
			if(n>10.5){
//				if(maxNum==-1){
//					maxArr.push(arr[i]);
//				}else{
//					maxNum = -1;
//					maxArr = [];
//					maxArr.push(arr[i]);
//				}
//				if(maxNum==0){
//					//maxNum = -1;
//					//maxArr = [];
//					maxArr.push(arr[i]);
//				}
				
			}else if(n==10.5){
				if(maxNum==10.5){
					maxArr.push(arr[i]);
				}else{
					maxNum = 10.5;
					maxArr = [];
					maxArr.push(arr[i]);
				}
				
			}else if(n>maxNum){
				maxNum = n;
				maxArr = [];
				maxArr.push(arr[i]);
				
			}else if(n==maxNum){
				maxArr.push(arr[i]);
			}
			
		}
		
		if(maxArr.length==0){
			maxNum = -1;
		}
		
	}
	
	if(maxNum!=minNum){
		//最大最小不同，有输赢家
		$(".body li").each(function(){
			for(var i=0;i<minArr.length;i++){
				for(var j=0;j<minArr[i].length;j++){
					if($(this).find("img").attr("cid")==minArr[i][j].id){
						//最小的牌，输
						$(this).addClass("losePoker");
					}
				}
				
			}
			for(var i=0;i<maxArr.length;i++){
				for(var j=0;j<maxArr[i].length;j++){
					if($(this).find("img").attr("cid")==maxArr[i][j].id){
						//最小的牌，输
						$(this).addClass("winPoker");
					}
				}
			}
		});
		
		for(var i=0;i<minArr.length;i++){
			allPlayer[minArr[i][0]["playerId"]]["money"] = allPlayer[minArr[i][0]["playerId"]]["money"] - setting.price*2*maxArr.length;
		}
		for(var i=0;i<maxArr.length;i++){
			allPlayer[maxArr[i][0]["playerId"]]["money"] = allPlayer[maxArr[i][0]["playerId"]]["money"] + setting.price*2*minArr.length;
			allPlayer[maxArr[i][0]["playerId"]]["winNum"]++;
		}
		setNewMoney();
	}else{
		//所有牌都一样大小，平局
		
		$(".body li").each(function(){
			for(var i=0;i<arr.length;i++){
				for(var j=0;j<arr[i].length;j++){
					if($(this).find("img").attr("cid")==arr[i][j].id){
						$(this).addClass("drawPoker");
					}
				}
				
			}
		});
	}
	
}

function showCompare3(){
	//展示第三轮
	var arr = [];
	for(var i=0;i<allPlayer.length;i++){
		arr.push(allPlayer[i].pokerCompare3)
	}
	for(var i=0;i<$(".body .AI").size();i++){
		$(".body .AI").eq(i).find("li img").eq(3).attr({
			'src' : 'images/poker'+(allPlayer[(i+1)].pokerCompare3[0].id)+'.jpg',
			'cid' : (allPlayer[(i+1)].pokerCompare3[0].id)
		});
		$(".body .AI").eq(i).find("li img").eq(4).attr({
			'src' : 'images/poker'+(allPlayer[(i+1)].pokerCompare3[1].id)+'.jpg',
			'cid' : (allPlayer[(i+1)].pokerCompare3[1].id)
		});
		$(".body .AI").eq(i).find("li img").eq(5).attr({
			'src' : 'images/poker'+(allPlayer[(i+1)].pokerCompare3[2].id)+'.jpg',
			'cid' : (allPlayer[(i+1)].pokerCompare3[2].id)
		});
	}
	getCompare3Results(arr);
	
	
}

function getCompare3Results(arr){
	var resulitArr = [];
	
	for(var i=0;i<arr.length;i++){
		resulitArr.push(getC3OneRes(arr[i]));
	}
	
	
	var winRes = getC3WinRes(resulitArr,0);
	var loseRes = getC3LoseRes(resulitArr,0);
	$(".body li").each(function(){
		for(var i=0;i<winRes.length;i++){
			for(var j=0;j<winRes[i]["arr"].length;j++){
				if($(this).find("img").attr("cid")==winRes[i]["arr"][j].id){
					$(this).addClass("winPoker");
				}
			}
		}
		for(var i=0;i<loseRes.length;i++){
			for(var j=0;j<loseRes[i]["arr"].length;j++){
				if($(this).find("img").attr("cid")==loseRes[i]["arr"][j].id){
					$(this).addClass("losePoker");
				}
			}
		}
	});
	
	
	for(var i=0;i<loseRes.length;i++){
		allPlayer[loseRes[i]["arr"][0]["playerId"]]["money"] = allPlayer[loseRes[i]["arr"][0]["playerId"]]["money"] - setting.price*3*loseRes.length;
	}
	
	for(var i=0;i<winRes.length;i++){
		allPlayer[winRes[i]["arr"][0]["playerId"]]["money"] = allPlayer[winRes[i]["arr"][0]["playerId"]]["money"] + setting.price*3*winRes.length;
		allPlayer[winRes[i]["arr"][0]["playerId"]]["winNum"]++;
	}
	if(setting.hasPlane){
		planeTax(loseRes,winRes);
	}else if(setting.hasBat){
		batTax(loseRes,winRes);
	}
	
	allWinTax();

	setNewMoney();
	console.log(winRes)
	console.log(loseRes)
	
}

function getC3OneRes(arr){
	
	var pokerObj;
	//获得一个玩家第三组牌的结果
	if(isPlane(arr)){
		//飞机,豹子
		setting.hasPlane = true;
		pokerObj = {
			"resType":[99],
			"arr" : arr
		};
		pokerObj["resType"] = pokerObj["resType"].concat(getOnePokerArrMax(arr))
		
	}else if(isBoat(arr)&&isConnect(arr)){
		//清连,顺金
		setting.hasBat = true;
		pokerObj = {
			"resType":[98],
			"arr" : arr
		};
		pokerObj["resType"] = pokerObj["resType"].concat(getOnePokerArrMax(arr))
		
	}else if(isBoat(arr)){
		//清色,金花

		pokerObj = {
			"resType":[97],
			"arr" : arr
		};
		pokerObj["resType"] = pokerObj["resType"].concat(getOnePokerArrMax(arr))
		
	}else if(isConnect(arr)){
		//顺子

		pokerObj = {
			"resType":[96],
			"arr" : arr
		};
		
		pokerObj["resType"] = pokerObj["resType"].concat(getOnePokerArrMax(arr))
		
	}else if(isCouple(arr)){
		//对子

		pokerObj = {
			"resType":[95],
			"arr" : arr
		};
		pokerObj["resType"] = pokerObj["resType"].concat(getOnePokerArrMaxForCouple(arr))

	}else{
		//单张
		
		var pokerObj = {
			"resType":[94],
			"arr" : arr
		};
		pokerObj["resType"] = pokerObj["resType"].concat(getOnePokerArrMax(arr))
		
	}
	
	return pokerObj;
}

function getC3WinRes(resulitArr,ind){
	//根据扎金花规则结果排出获胜
	if(ind>5){
		console.log("出错")
		return false;
	}
	var maxTypeNum = 0;
	var maxPokerArr = [];
	for(var i=0;i<resulitArr.length;i++){
		tmpNum = resulitArr[i]["resType"][ind];
		
		if(tmpNum>maxTypeNum){
			maxTypeNum = tmpNum;
			maxPokerArr = [];
			maxPokerArr.push(resulitArr[i]);
		}else if(maxTypeNum==tmpNum){
			maxPokerArr.push(resulitArr[i]);
		}
		
		
	}

	if(maxPokerArr.length==1){
		return maxPokerArr;
	}else{
		return getC3WinRes(maxPokerArr,(ind+1));
	}
	
}

function getC3LoseRes(resulitArr,ind){
	//根据扎金花规则结果排出失败
	if(ind>5){
		console.log("出错")
		return false;
	}
	var maxTypeNum = 99;
	var maxPokerArr = [];
	for(var i=0;i<resulitArr.length;i++){
		tmpNum = resulitArr[i]["resType"][ind];
		if(tmpNum<maxTypeNum){
			maxTypeNum = tmpNum;
			maxPokerArr = [];
			maxPokerArr.push(resulitArr[i]);
		}else if(maxTypeNum==tmpNum){
			maxPokerArr.push(resulitArr[i]);
		}
		
	}
	
	if(maxPokerArr.length==1){
		return maxPokerArr;
	}else{
		return getC3LoseRes(maxPokerArr,(ind+1));
	}
	
}

function getOnePokerArrMaxForCouple(pokerArr){
	var resArr = [];
	if(pokerArr[0].num==pokerArr[2].num){
		resArr.push(pokerArr[0].num);
		resArr.push(pokerArr[2].num);
		resArr.push(pokerArr[1].num);
	}else if(pokerArr[1].num==pokerArr[2].num){
		resArr.push(pokerArr[1].num);
		resArr.push(pokerArr[2].num);
		resArr.push(pokerArr[0].num);
	}else{
		resArr.push(pokerArr[0].num);
		resArr.push(pokerArr[1].num);
		resArr.push(pokerArr[2].num);
	}

	return resArr;
}

function getOnePokerArrMax(pokerArr){
	//按num从大到小排序
	var sortArr = [];
	for(var i=0;i<pokerArr.length;i++){
		sortArr.push(pokerArr[i].num);
	}
	
	sortArr.sort(function(a,b){return a<b?1:-1});

	return sortArr;
}

function setNewMoney(){
	$(".body .player").each(function(){
		$(this).find(".money").html(allPlayer[parseInt($(this).attr("playerId"))]["money"]);
	})
}

function tip(){
	$(".tipTxt1").show();
	setTimeout(function(){
		$(".guide .deck").addClass("deck2");
	},600);
	
	$(".guide .next").click(function(){
		var oAI1 = $(".tipAI1 li");
		var oAI2 = $(".tipAI2 li");
		var oDeck = $(".deck li");
		setting.tipInd++;
		if(setting.tipInd==1){
			oAI1.eq(0).addClass("tipLiShow");
			oAI2.eq(0).addClass("tipLiShow");
			$(".deck li").addClass("tipLiHide").eq(0).removeClass("tipLiHide");
			$(".tipTxt").hide();
			$(".tipTxt2").show();
		}else if(setting.tipInd==2){
			oAI1.eq(0).removeClass("tipLiShow");
			oAI2.eq(0).removeClass("tipLiShow");
			oAI1.eq(1).addClass("tipLiShow");
			oAI1.eq(2).addClass("tipLiShow");
			oAI2.eq(1).addClass("tipLiShow");
			oAI2.eq(2).addClass("tipLiShow");
			oDeck.addClass("tipLiHide").eq(1).removeClass("tipLiHide");
			oDeck.eq(2).removeClass("tipLiHide");
			$(".tipTxt").hide();
			$(".tipTxt3").show();
		}else if(setting.tipInd==3){
			oAI1.eq(1).removeClass("tipLiShow");
			oAI1.eq(2).removeClass("tipLiShow");
			oAI1.eq(3).addClass("tipLiShow");
			oAI1.eq(4).addClass("tipLiShow");
			oAI1.eq(5).addClass("tipLiShow");
			oAI2.eq(1).removeClass("tipLiShow");
			oAI2.eq(2).removeClass("tipLiShow");
			oAI2.eq(3).addClass("tipLiShow");
			oAI2.eq(4).addClass("tipLiShow");
			oAI2.eq(5).addClass("tipLiShow");
			oDeck.addClass("tipLiHide").eq(3).removeClass("tipLiHide");
			oDeck.eq(4).removeClass("tipLiHide");
			oDeck.eq(5).removeClass("tipLiHide");
			$(".tipTxt").hide();
			$(".tipTxt4").show();
			$(this).hide();
		}
		
	});
	
	$(".guide .begin").click(function(){
		$(".guide").fadeOut();
		play();
		selectPoker();
	});
	
}

function planeTax(loseArr,winArr){
	//飞机税
	for(var i=0;i<loseArr.length;i++){
		if(loseArr[i]["resType"][0]!=99){
			allPlayer[loseArr[i]["arr"][0]["playerId"]]["money"] = allPlayer[loseArr[i]["arr"][0]["playerId"]]["money"] - setting.price*3;
		}
	}
	for(var i=0;i<winArr.length;i++){
		if(winArr[i]["resType"][0]==99){
			allPlayer[winArr[i]["arr"][0]["playerId"]]["money"] = allPlayer[winArr[i]["arr"][0]["playerId"]]["money"] + setting.price*3;
		}
	}
	
}

function batTax(loseArr,winArr){
	//顺清税
	for(var i=0;i<loseArr.length;i++){
		if(loseArr[i]["resType"][0]!=98){
			allPlayer[loseArr[i]["arr"][0]["playerId"]]["money"] = allPlayer[loseArr[i]["arr"][0]["playerId"]]["money"] - setting.price;
		}
	}
	for(var i=0;i<winArr.length;i++){
		if(winArr[i]["resType"][0]==98){
			allPlayer[winArr[i]["arr"][0]["playerId"]]["money"] = allPlayer[winArr[i]["arr"][0]["playerId"]]["money"] + setting.price;
		}
	}
	
}

function allWinTax(){
	//全胜税
	
	for(var i=0;i<allPlayer.length;i++){
		if(allPlayer[i].winNum==3){
			for(var j=0;j<allPlayer.length;j++){
				if(allPlayer[j].winNum!=3){
					allPlayer[j]["money"] = allPlayer[j]["money"] - setting.price*3;
					allPlayer[i]["money"] = allPlayer[i]["money"] + setting.price*3;

				}
			}
			
		}
	}
	
}

